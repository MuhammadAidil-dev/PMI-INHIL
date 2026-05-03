import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_KEYS } from './lib/cookies/cookies';

// ============================================================
// middleware.ts (letakkan di root: src/middleware.ts)
//
// Proteksi route berdasarkan keberadaan token di cookie.
// Validasi JWT dilakukan di backend — middleware hanya cek
// apakah cookie ada atau tidak (fast check, tidak fetch ke API).
// ============================================================

const PUBLIC_PATHS = ['/auth/login', '/'];

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATHS.some((path) => pathname.startsWith(path));

export function proxy(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // const token = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value;

  // // // Sudah login, coba akses /login → redirect ke dashboard
  // if (token && isPublicPath(pathname)) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // // // Belum login, coba akses route protected → redirect ke login
  // if (!token && !isPublicPath(pathname)) {
  //   const loginUrl = new URL('/auth/login', request.url);
  //   // Simpan URL tujuan asal untuk redirect setelah login (opsional)
  //   loginUrl.searchParams.set('callbackUrl', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  /*
   * Jalankan middleware pada semua path kecuali:
   * - _next/static  → file statis Next.js
   * - _next/image   → optimasi gambar Next.js
   * - favicon.ico   → favicon
   * - /api          → API routes (jika ada)
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
