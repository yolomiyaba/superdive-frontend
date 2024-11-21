import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Current Pathname:', request.nextUrl.pathname);

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/session', request.url));
  }
}