'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const PUBLIC_ROUTES = ['/login', '/register'];

export default function AuthGuard({ children }) {
  const [username, setUsername] = useState(null); 
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Se rota for pública, não precisa validar token
    if (isPublic) {
      setLoading(false);
      return;
    }

    // Se não tiver token, redireciona para login
    if (!token) {
      router.replace('/login');
      return;
    }

    // Valida o token com a API
    fetch(`${baseUrl}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          res.json().then(data => {
            setUsername(data.username);
            setAuthorized(true);
          });
        } else {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.replace('/login');
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  // Bloqueia qualquer render até o loading acabar
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  // Página pública: renderiza normalmente
  if (isPublic) {
    return (
      <AuthContext.Provider value={{ authorized: false, loading, username  }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Página protegida + autorizado: renderiza
  if (authorized) {
    return (
      <AuthContext.Provider value={{ authorized, loading, username }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Página protegida + não autorizado: não renderiza nada (já redirecionou)
  return null;
}
