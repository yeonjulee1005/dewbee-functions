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
}

type ViewDailyResultList = Database['public']['Views']['viewDailyResultList']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
  currency: FilterDatabase['filter']['Tables']['currency']['Row']
}

serve(async (req) => {
  const payload: { time: string } = await req.json()

  console.log('🧘🏻 Daily Spend Result Start Timestamp', payload.time)

  try {
    const { data: allUsers, error: allUsersError } = await supabase
      .from('viewProfiles')
      .select('*')
    
    if (allUsersError) throw allUsersError

    for (const user of allUsers as UserProfiles[]) {
      const selectEndDate = user.endDate.code ?? 'EDC001'

      const dayOfWeekMap = {
        'EDC001': 1, // 월요일
        'EDC002': 2, // 화요일
        'EDC003': 3, // 수요일
        'EDC004': 4, // 목요일
        'EDC005': 5, // 금요일
        'EDC006': 6, // 토요일
        'EDC007': 0, // 일요일
      }

      const targetDayOfWeek = dayOfWeekMap[selectEndDate]

      const payloadDate = new Date(payload.time)
      const isSameDayOfWeek: Boolean = payloadDate.getDay() === targetDayOfWeek

      if (!isSameDayOfWeek) {
        console.log('🐬 Not Same Day Of Week / User Name', user.nickname)
        continue
      }

      const searchEndDate = isSameDayOfWeek ? new Date().toISOString().split('T')[0].concat(' 00:00:00') : null
      const oneWeekBeforeDate = isSameDayOfWeek ? new Date(payloadDate.setDate(payloadDate.getDate() - 7)).toISOString().split('T')[0].concat(' 00:00:00') : null

      console.log('🐬 One Week Before Date', oneWeekBeforeDate)
      console.log('🐬 Search End Date', searchEndDate)

      const userId = user.id
      const userWeeklyTargetAmount = user.weekly_target_amount ?? 0
      const userCurrencyId = user.currency.id ?? ''
      const userCurrencyCode = user.currency.code ?? ''
      const userEndDateId = user.end_date_id ?? ''

      const { data: dailyResultList, error: dailyResultListError } = await supabase
        .from('viewDailyResultList')
        .select('*')
        .eq('update_user_id', userId)
        .gte('created_at', oneWeekBeforeDate)
        .lte('created_at', searchEndDate)

      if (dailyResultListError) throw dailyResultListError

      if (dailyResultList.length === 0) {
        console.log('🐬 No Spend This Week / User Name', user.nickname)
        continue
      }

      console.log('🐬 Daily Result List', dailyResultList)

      let weeklySummaryAmount = 0

      for (const spend of dailyResultList as ViewDailyResultList[]) {
        const amount = spend.summary_amount ?? 0
        const currencyCode = spend.currency.code ?? ''

        const convertedAmount = (await convertCurrency(amount, currencyCode, userCurrencyCode)).amount

        weeklySummaryAmount += convertedAmount
      }

      const createPayload = {
        summary_amount: weeklySummaryAmount.toFixed(2),
        is_success: userWeeklyTargetAmount >= weeklySummaryAmount,
        weekly_target_amount: userWeeklyTargetAmount,
        currency_id: userCurrencyId,
        end_date_id: userEndDateId,
        update_user_id: userId,
      }

      const { data: response, error: weeklyResultListError } = await supabase
        .from('weeklyResultList')
        .upsert(createPayload)
        .select()

      if (weeklyResultListError) throw weeklyResultListError

      console.log('🐬 Result Create Success / User Name', user.nickname)
      console.log('🐬 Result Create Success / response', response)
    }

    console.log('🎇 Finished Create Weekly Result Function')

    return new Response(JSON.stringify({ body: JSON.stringify(payload.time) }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})

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