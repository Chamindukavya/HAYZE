import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: any) {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    const tokenRole = typeof token.role === 'string' ? token.role.toLowerCase() : '';
    const tokenEmail = typeof token.email === 'string' ? token.email.trim().toLowerCase() : '';
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || '';

    // Check for admin role or whitelisted admin email
    if (tokenRole !== 'admin' && tokenEmail !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
