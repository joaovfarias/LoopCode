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
  }, [pathname]);

  if (!authorized && pathname !== '/login' && pathname !== '/register') {
    return null;
  }

  return <>{children}</>;
}
