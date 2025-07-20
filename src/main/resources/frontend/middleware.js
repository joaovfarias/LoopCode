import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('isLoggedIn');

  if (isLoggedIn?.value !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Aplica o middleware apenas às rotas especificadas
export const config = {
  matcher: ['/usuarios/:path*', "/"],
};
