import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import type { Database } from './types'
import type { Database as FilterDatabase } from './filter-types'

console.log('🏅 init Daily Spend Result Function')

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

type UserProfiles = Database['public']['Views']['viewProfiles']['Row'] & {
  currency: FilterDatabase['filter']['Tables']['currency']['Row']
  endDate: FilterDatabase['filter']['Tables']['endDate']['Row']
  localTimezone: FilterDatabase['filter']['Tables']['localTimezone']['Row']
}

type ViewSpendList = Database['public']['Views']['viewSpendList']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
  currency: FilterDatabase['filter']['Tables']['currency']['Row']
  spendCategory: FilterDatabase['filter']['Tables']['spendCategory']['Row']
}

serve(async (req) => {
  const payload: { time: string } = await req.json()

  const date = new Date(payload.time)
  date.setDate(date.getDate() - 1)

  const yesterday = date.toISOString().split('T')[0]

  console.log('🧘🏻 Daily Spend Result Start Timestamp', payload.time)

  try {
    const { data: allUsers, error: allUsersError } = await supabase
      .from('viewProfiles')
      .select('*')
    
    if (allUsersError) throw allUsersError

    for (const user of allUsers as UserProfiles[]) {
      const userId = user.id
      const userCurrencyId = user.currency.id ?? ''
      const userCurrencyCode = user.currency.code ?? ''
      const userLocalTimezoneOffset = user.localTimezone.utc_offset ?? 0

      const startSearchDate = adjustTimezone(yesterday.concat('T00:00:00.000Z'), userLocalTimezoneOffset)
      const endSearchDate = adjustTimezone(yesterday.concat('T23:59:59.000Z'), userLocalTimezoneOffset)

      console.log('🔎 Search Date Range', startSearchDate, endSearchDate)

      const { data: spendList, error: spendListError } = await supabase
        .from('viewSpendList')
        .select('*')
        .eq('update_user_id', userId)
        .gte('created_at', startSearchDate)
        .lte('created_at', endSearchDate)

      if (spendListError) throw spendListError

      if (spendList.length === 0) {
        console.log('🐬 No Spend Data / User Name', user.nickname)
        continue
      }

      let dailySummaryAmount = 0

      for (const spend of spendList as ViewSpendList[]) {
        const amount = spend.amount ?? 0
        const currencyCode = spend.currency.code ?? ''

        const convertedAmount = (await convertCurrency(amount, currencyCode, userCurrencyCode)).amount

        dailySummaryAmount += convertedAmount
      }

      const createPayload = {
        summary_amount: dailySummaryAmount.toFixed(2),
        currency_id: userCurrencyId,
        update_user_id: userId,
      }

      const { data: response, error: dailyResultListError } = await supabase
        .from('dailyResultList')
        .upsert(createPayload)
        .select()

      if (dailyResultListError) throw dailyResultListError

      console.log('🐬 Result Create Success / User Name', user.nickname)
      console.log('🐬 Result Create Success / response', response)
    }

    console.log('🎇 Finished Create Daily Result Function')

    return new Response(JSON.stringify({ body: JSON.stringify(payload.time) }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})

function adjustTimezone (dateString: string, offset: number) {
  const date = new Date(dateString)
  date.setHours(date.getHours() - offset)
  return date.toISOString().replace('T', ' ').split('.')[0]
}

async function convertCurrency(amount: number, amountCurrency: string, userCurrency: string) {
  const resUsd: any = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
  const usdData = await resUsd.json()
  const resKrw: any = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json')
  const krwData = await resKrw.json()
  const resJpy: any = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json')
  const jpyData = await resJpy.json()

  const usdToKrw = usdData.usd.krw
  const usdToJpy = usdData.usd.jpy

  const krwToUsd = krwData.krw.usd
  const krwToJpy = krwData.krw.jpy

  const jpyToUsd = jpyData.jpy.usd
  const jpyToKrw = jpyData.jpy.krw

  if (amountCurrency === 'CYC001') {
    if (userCurrency === 'CYC002') return { amount: parseFloat((amount * krwToUsd).toFixed(2)), currencyCode: 'CYC002' }
    else if (userCurrency === 'CYC003') return { amount: parseFloat((amount * krwToJpy).toFixed(2)), currencyCode: 'CYC003' }
    else return { amount, currencyCode: 'CYC001' }
  }
  if (amountCurrency === 'CYC002') {
    if (userCurrency === 'CYC001') return { amount: parseFloat((amount * usdToKrw).toFixed(2)), currencyCode: 'CYC001' }
    else if (userCurrency === 'CYC003') return { amount: parseFloat((amount * usdToJpy).toFixed(2)), currencyCode: 'CYC003' }
    else return { amount, currencyCode: 'CYC002' }
  }
  else {
    if (userCurrency === 'CYC002') return { amount: parseFloat((amount * jpyToUsd).toFixed(2)), currencyCode: 'CYC002' }
    else if (userCurrency === 'CYC001') return { amount: parseFloat((amount * jpyToKrw).toFixed(2)), currencyCode: 'CYC001' }
    else return { amount, currencyCode: 'CYC003' }
  }
}