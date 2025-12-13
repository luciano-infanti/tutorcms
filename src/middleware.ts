import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // IMPORTANTE: Permitir arquivos estáticos ANTES de qualquer outra verificação
  // Isso garante que imagens, fontes e outros arquivos estáticos sejam servidos
  const isStaticFile = path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i)
  if (isStaticFile) {
    return NextResponse.next()
  }
  
  // Permitir também arquivos da pasta public (sem extensão conhecida)
  if (path.startsWith('/image4') || path.startsWith('/background')) {
    return NextResponse.next()
  }
  
  // 1. Check for Global Site Access
  const siteAccessCookie = request.cookies.get('site_access_token')
  const isGlobalGate = path === '/'
  
  // If no access token and not on the gate page, redirect to gate
  if (!siteAccessCookie && !isGlobalGate && !path.startsWith('/api') && !path.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If has access token and on gate page, redirect to dashboard (or login if not auth'd)
  if (siteAccessCookie && isGlobalGate) {
    // We let them proceed to /dashboard, where NextAuth middleware (or client check) will handle the rest
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (images, fonts, etc.)
     * - arquivos específicos da pasta public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|image4|background|.*\\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$).*)',
  ],
}
