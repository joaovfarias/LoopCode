'use client';

import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}, Senha: ${senha}`);

    // Após login com sucesso
    document.cookie = "isLoggedIn=true; path=/; max-age=3600"; // cookie válido por 1 hora

    // Ir para a página home após o login
    window.location.href = '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className='w-full max-w-md p-3'>
        <CardContent>

          <Image src="/images/logo.png" alt="image" width={100} height={100} className="mx-auto mb-6" />
                
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Entrar
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
