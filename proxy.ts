import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const userSession = request.cookies.get('auth_session');
    
    if (!userSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(userSession.value);
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'PARTNER')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect /favorites and /dashboard routes
  if (pathname.startsWith('/favorites') || pathname.startsWith('/dashboard')) {
    const userSession = request.cookies.get('auth_session');
    
    if (!userSession) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Optional: Verify the token
    const payload = await verifyToken(userSession.value);
    if (!payload) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/favorites/:path*', '/dashboard/:path*'],
};
