import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('🏅 init Daily Spend Result Function')

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

serve(async (req) => {
  const payload: { time: string } = await req.json()

  console.log('🧘🏻 Daily Spend Result Start Timestamp', payload.time)

  try {
    // const { data: allUsers, error: allUsersError } = await supabase
    //   .from('profiles')
    //   .select('id, heart_point')
    
    // if (allUsersError) throw allUsersError

    // const refreshAllUsersHeart = allUsers.map((user) => {
    //   return {
    //     id: user.id,
    //     heart_point: 10
    //   }
    // })

    // console.log('🧘🏻 Be Refresh All Users Heart', refreshAllUsersHeart)

    // const { data: response, error: responseError } = await supabase
    //   .from('profiles')
    //   .upsert(refreshAllUsersHeart)
    //   .select()

    // if (responseError) throw responseError

    console.log('🐬 After Refresh All Users Heart', response)

    console.log('🎇 Finished Heart Schedule Function')

    return new Response(JSON.stringify({ body: JSON.stringify(response) }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})