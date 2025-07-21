// components/NavWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '../app/auth-guard';
import Nav from './Nav';

export default function NavWrapper() {
  const pathname = usePathname();
  const { loading } = useAuth() || {}; 

  const hiddenRoutes = ['/login', '/register'];

  if (hiddenRoutes.includes(pathname) || loading) {
    return null;
  }

  return <Nav />;
}
