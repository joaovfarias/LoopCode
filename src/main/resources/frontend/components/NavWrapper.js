'use client';

import { usePathname } from 'next/navigation';
import Nav from './Nav';

export default function NavWrapper() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return <Nav />;
}
