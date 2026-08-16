// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Buat response awal
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Ambil data user dari session yang ada di cookies
  const { data: { user } } = await supabase.auth.getUser()

  const isAccessingAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isAccessingLogin = request.nextUrl.pathname.startsWith('/admin/login');

  // Aturan 1: Belum login + Akses Dashboard -> Redirect ke Login
  if (!user && isAccessingAdmin && !isAccessingLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Aturan 2: Sudah login + Akses halaman Login -> Redirect ke Dashboard
  if (user && isAccessingLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// Konfigurasi path mana saja yang dicek oleh middleware ini
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}