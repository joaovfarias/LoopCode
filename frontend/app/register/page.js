'use client';

import {
  CardContent,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
  Link,
  TextField
} from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);

  const handleClickShowPassword = () => setMostrarSenha((show) => !show);
  const handleClickShowConfirmar = () => setMostrarConfirmar((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErroSenha(true);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email: email, password: senha, role: 'USER' }),
      });

      if (!response.ok) throw new Error('Erro ao registrar');
      
      alert('Registrado com sucesso!');
      window.location.href = '/login';
    } catch (err) {
      alert(err.message);
    }
  };

  const login = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-3 relative min-h-[450px]">
        <div className="absolute inset-0">
          <CardContent>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
            />

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

              {/* SENHA */}
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="senha">Senha</InputLabel>
                <OutlinedInput
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  label="Senha"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {/* CONFIRMAR SENHA */}
              <FormControl variant="outlined" fullWidth required error={erroSenha}>
                <InputLabel htmlFor="confirmarSenha">Confirmar Senha</InputLabel>
                <OutlinedInput
                  id="confirmarSenha"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  label="Confirmar Senha"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={handleClickShowConfirmar}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {mostrarConfirmar ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {erroSenha && (
                  <FormHelperText>As senhas não coincidem.</FormHelperText>
                )}
              </FormControl>

              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Registrar
              </Button>

              <Link
                color="inherit"
                underline="none"
                onClick={login}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                Já tem uma conta? Faça login
              </Link>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
