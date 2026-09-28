// src/proxy.ts (Next 16's name for middleware)
// - admin.regiofoods.in → the admin panel (bare "/" goes to /admin)
// - regiofoods.in/admin → sent to the admin subdomain
// - /admin pages need a signed-in admin (API routes check with requireAdmin)
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const envList = (v?: string) =>
  (v ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

const ADMIN_HOSTS = new Set([
  'admin.regiofoods.in',
  'admin.localhost',
  ...envList(process.env.ADMIN_HOSTS),
]);

const PUBLIC_HOSTS = new Set([
  'regiofoods.in',
  'www.regiofoods.in',
  ...envList(process.env.PUBLIC_HOSTS),
]);

function hostOf(req: NextRequest) {
  const raw = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  return raw.split(',')[0]!.trim().replace(/:\d+$/, '').toLowerCase();
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = hostOf(req);
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuthPath = pathname.startsWith('/auth/');

  // Public domain: the admin lives on its own subdomain.
  if (PUBLIC_HOSTS.has(host) && (isAdminPath || isAuthPath)) {
    const adminHost = process.env.ADMIN_PUBLIC_HOST || 'admin.regiofoods.in';
    return NextResponse.redirect(`https://${adminHost}${pathname}${search}`);
  }

  // Admin subdomain: bare "/" opens the dashboard.
  if (ADMIN_HOSTS.has(host) && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  if (isAdminPath) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.search = '';
      url.searchParams.set('callbackUrl', pathname + search);
      return NextResponse.redirect(url);
    }

    if (token.role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.search = '?error=forbidden';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/|api/|assets/|images/|uploads/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
