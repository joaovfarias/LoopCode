'use client';

import { Card, CardContent, TextField, Button, Slide, Link } from '@mui/material';
import { useState } from 'react';
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [name, setName] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false); // alterna entre login e registro

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Email: ${email}, Senha: ${senha}`);
    document.cookie = "isLoggedIn=true; path=/; max-age=3600";
    window.location.href = '/';
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    alert(`Registrado: ${email}`);
    setModoRegistro(false); // volta para login após registro
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      <div className="w-full max-w-md p-3 relative min-h-[300px]">
        {/* Formulário de Login */}
        <Slide direction="left" in={!modoRegistro} mountOnEnter unmountOnExit>
          <div className="absolute inset-0">
            <CardContent>
              <Image src="/images/logo.png" alt="image" width={100} height={100} className="mx-auto mb-6" />
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                <Button type="submit" variant="contained" color="secondary" fullWidth>
                  Entrar
                </Button>
                <Link color="inherit" underline="none" onClick={() => setModoRegistro(true)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  Não tem uma conta? Registre-se
                </Link>
              </form>
            </CardContent>
          </div>
        </Slide>

        {/* Formulário de Registro */}
        <Slide direction="right" in={modoRegistro} mountOnEnter unmountOnExit>
          <div className="absolute inset-0">
            <CardContent>
              <Image src="/images/logo.png" alt="image" width={100} height={100} className="mx-auto mb-6" />
              <form onSubmit={handleRegistro} className="flex flex-col gap-4">
                <TextField
                  label="Nome"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
                <Button type="submit" variant="contained" color="secondary" fullWidth>
                  Registrar
                </Button>
                <Link color="inherit" underline="none" onClick={() => setModoRegistro(false)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  Já tem uma conta? Faça login
                </Link>
              </form>
            </CardContent>
          </div>
        </Slide>
      </div>
    </div>
  );
}
