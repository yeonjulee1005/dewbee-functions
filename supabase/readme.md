
# `Supabase` 로그인 커맨드
> supabase login

# `Supabase` 초기화
> supabase init

# `Supabase Functions` 생성 커맨드
> supabase functions new {Function Name}

# `Supabase Functions` 배포 커맨드
> supabase functions deploy {Function Name} --project-ref biynqxysclkvwrscmupr

# `Supabase cli를` 이용한 환경변수 셋업 커맨드

> supabase secrets set {key}={value}

# supabase type 생성
> npx supabase gen types typescript --project-id biynqxysclkvwrscmupr --schema public > supabase/functions/{Function Name}/types.ts
> npx supabase gen types typescript --project-id biynqxysclkvwrscmupr --schema filter > supabase/functions/{Function Name}/filter-types.ts
# wnm-functions