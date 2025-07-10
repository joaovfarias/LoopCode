import { NextResponse } from 'next/server';

export function middleware(request) {
// Aqui verifica se o usuário está autenticado
  if (false) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Aplica apenas nas rotas /exercicios/**
export const config = {
  matcher: ['/exercicios/:path*'],
};
