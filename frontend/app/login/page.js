"use client";

import {
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  OutlinedInput,
  InputLabel,
  FormControl,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import Image from "next/image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Credenciais inválidas. Por favor, tente novamente."
  );
  const [errorSeverity, setErrorSeverity] = useState("error");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: senha }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          try {
            const errorData = await response.json();
            if (errorData.error === "BANNED_USER") {
              setErrorMessage(
                `Você foi banido permanentemente. Motivo: ${errorData.reason}`
              );
            } else if (errorData.error === "TIMED_OUT_USER") {
              const timeoutEndDate = new Date(errorData.timeoutEndDate);
              const formattedDate = timeoutEndDate.toLocaleString("pt-BR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              setErrorMessage(
                `Você está temporariamente suspenso até ${formattedDate}. Motivo: ${errorData.reason}`
              );
            } else {
              setErrorMessage(
                "Credenciais inválidas. Por favor, tente novamente."
              );
            }
          } catch {
            setErrorMessage(
              "Credenciais inválidas. Por favor, tente novamente."
            );
          }
          setErrorSeverity("error");
        } else if (response.status === 401) {
          setErrorMessage("Credenciais inválidas. Por favor, tente novamente.");
          setErrorSeverity("error");
        } else {
          setErrorMessage("Erro no servidor. Tente novamente mais tarde.");
          setErrorSeverity("error");
        }
        setOpen(true);
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token); // salva token
      router.push("/"); // redireciona
    } catch (err) {
      console.log(err.message);
      setErrorMessage("Erro de conexão. Tente novamente.");
      setErrorSeverity("error");
      setOpen(true);
    }
  };

  const registrar = () => {
    router.push("/register");
  };

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  return (
    <div className="relative min-h-[calc(100vh-32px)] flex items-center justify-center overflow-hidden">
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          severity={errorSeverity}
          onClose={handleClose}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <div className="w-full max-w-md p-3 relative min-h-[300px]">
        <div className="absolute inset-0">
          <CardContent>
            <Image
              src="/images/logo.png"
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100px", height: "auto" }}
              className="mx-auto mb-6"
              priority
            />

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <TextField
                label="email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="senha">senha</InputLabel>
                <OutlinedInput
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
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
                        {mostrarSenha ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Entrar
              </Button>

              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                style={{ marginTop: "16px" }}
              >
                Não tem uma conta?{" "}
                <Link
                  color="secondary"
                  underline="none"
                  onClick={registrar}
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  Registre-se
                </Link>
              </Typography>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
