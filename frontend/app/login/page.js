'use client';

import {
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  OutlinedInput,
  InputLabel,
  FormControl
} from '@mui/material';
import { useState } from 'react';
import Image from "next/image";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    document.cookie = "isLoggedIn=true; path=/; max-age=3600";
    window.location.href = '/';
  };

  const registrar = () => {
    window.location.href = '/register';
  };

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md p-3 relative min-h-[300px]">
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
                        onClick={() => setMostrarSenha((prev) => !prev)}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {mostrarSenha ? <VisibilityOffIcon/> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Entrar
              </Button>

              <Link
                color="inherit"
                underline="none"
                onClick={registrar}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                Não tem uma conta? Registre-se
              </Link>

            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
