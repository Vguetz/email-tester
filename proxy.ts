// middleware.ts (En la raíz del proyecto)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // 1. Creamos una respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Inicializamos el cliente de Supabase optimizado para SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Obtenemos el usuario (Validación fuerte)
  const { data: { user } } = await supabase.auth.getUser()

  // --- LÓGICA DE REDIRECCIÓN ---

  // Si no hay usuario y trata de entrar al Studio (/tester), al login.
  if (!user && request.nextUrl.pathname.startsWith('/tester')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si ya hay usuario y trata de ir al login, al Studio.
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/tester', request.url))
  }

  return response
}

// Configuración del Matcher: qué rutas debe vigilar el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono)
     * - public (archivos en carpeta public)
     * - auth (nuestro callback de supabase)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
}   