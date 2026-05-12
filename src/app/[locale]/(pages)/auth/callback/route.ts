import { createSupabaseServerClient } from '@/app/api/_lib/supabaseClient'
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'

  if (!next.startsWith('/')) next = '/'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // 1. In dev, always stay on the current origin (localhost:3000, etc.)
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // 2. In production, handle subdomains
      const forwardedHost = request.headers.get('x-forwarded-host')
      const protocol = 'https'
      
      // If we have a forwarded host and it's our domain, use it. Otherwise, fallback to the request origin.
      const finalHost = (forwardedHost && forwardedHost.endsWith('thresholdmedia.group')) 
        ? forwardedHost 
        : new URL(origin).host 

      return NextResponse.redirect(`${protocol}://${finalHost}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
// if (code) {
//   const supabase = await createSupabaseServerClient()
//   const { error } = await supabase.auth.exchangeCodeForSession(code)
//   if (!error) {
//     const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
//     const isLocalEnv = process.env.NODE_ENV === 'development'
//     if (isLocalEnv) {
//       // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
//       return NextResponse.redirect(`${origin}${next}`)
//     } else if (forwardedHost) {
//       return NextResponse.redirect(`https://${forwardedHost}${next}`)
//     } else {
//       return NextResponse.redirect(`${origin}${next}`)
//     }
//   }
// }