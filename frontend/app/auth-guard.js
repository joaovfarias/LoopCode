'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const token = localStorage.getItem('token');
    
    if (!publicPaths.includes(pathname) && !token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }

    // Verifica se o token é válido
    if (token && !publicPaths.includes(pathname)) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => {
          if (!response.ok) {
            localStorage.removeItem('token');
            router.push('/login');
          } else {
            setAuthorized(true);
          }
        })
        .catch((e) => {
          localStorage.removeItem('token');
          router.push('/login');
        });
    }
  }, [pathname]);

  if (!authorized && pathname !== '/login' && pathname !== '/register') {
    return null;
  }

  return <>{children}</>;
}
