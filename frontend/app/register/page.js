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
  TextField,
  Snackbar,
  Alert,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [erroSenhaText, setErroSenhaText] = useState('As senhas não coincidem.');

  const handleClickShowPassword = () => setMostrarSenha((show) => !show);
  const handleClickShowConfirmar = () => setMostrarConfirmar((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErroSenhaText('As senhas não coincidem.');
      setErroSenha(true);
      return;
    }
    if (senha.length < 8) {
      setErroSenhaText('A senha deve ter pelo menos 8 caracteres.');
      setErroSenha(true);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      // Register user
      const registerResponse = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email: email, password: senha, role: 'USER' }),
      });

      if (!registerResponse.ok) {
        setOpen(true);
        return;
      }

      // Login user
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: senha }),
      });

      if (!loginResponse.ok) {
        setOpen(true);
      }

      // Redirect to home page
      const data = await loginResponse.json();
      localStorage.setItem('token', data.token);
      router.push('/');
    } catch (err) {
      console.error('Erro ao registrar ou fazer login:', err);
    }
  };

  const login = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          severity="error"
          onClose={handleClose}
          variant="filled"
          sx={{ width: '100%' }}
        >
          Ocorreu um erro ao registrar. Tente novamente.
        </Alert>
      </Snackbar>

      <div className="w-full max-w-md p-3 relative min-h-[450px]">
        <div className="absolute inset-0">
          <CardContent>
            <Image
              src="/images/logo.png"
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100px', height: 'auto' }}
              className="mx-auto mb-6"
              priority
            />

            <form onSubmit={handleRegistro} className="flex flex-col gap-4">

              <TextField
                label="username"
                type="text"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextField
                label="email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* SENHA */}
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="senha">senha</InputLabel>
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
                <InputLabel htmlFor="confirmarSenha">confirmar senha</InputLabel>
                <OutlinedInput
                  id="confirmarSenha"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  label="confirmar senha"
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
                  <FormHelperText>{erroSenhaText}</FormHelperText>
                )}
              </FormControl>

              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Registrar
              </Button>

              <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '16px' }}>
                Já possui uma conta? <Link
                  color="secondary"
                  underline="none"
                  onClick={login}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  Faça login
                </Link>
              </Typography>

            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
