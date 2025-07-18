"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CriarExercicioPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    titulo: "",
    linguagem: "",
    dificuldade: "",
    descricao: "",
    casosDeUso: [],
    casoDeUsoAtual: "",
  });

  const linguagens = ["JavaScript", "Python", "Java", "C", "C++"];
  const dificuldades = ["Fácil", "Média", "Difícil"];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const adicionarCasoDeUso = () => {
    const caso = formData.casoDeUsoAtual.trim();
    if (!caso) return;

    setFormData((prev) => ({
      ...prev,
      casosDeUso: [...prev.casosDeUso, caso],
      casoDeUsoAtual: "",
    }));
  };

  const removerCasoDeUso = (index) => {
    setFormData((prev) => {
      const novosCasos = [...prev.casosDeUso];
      novosCasos.splice(index, 1);
      return { ...prev, casosDeUso: novosCasos };
    });
  };

  const handleProximo = () => {
    setStep((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalizar = () => {
    console.log("Dados enviados:", formData);
    alert("Dados enviados! Veja no console.");
    // Aqui você pode mandar pro backend, API, etc
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "card.primary",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        {step === 1 && (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Título do Exercício
            </Typography>
            <TextField
              fullWidth
              placeholder="Digite o título do exercício"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#0f172a",
                  borderRadius: 1,
                },
                "& .MuiInputLabel-root": {
                  color: "gray",
                },
              }}
            />

            <Typography variant="h6" gutterBottom>
              Linguagem
            </Typography>
            <TextField
              fullWidth
              select
              name="linguagem"
              value={formData.linguagem}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#0f172a",
                  color: "white",
                  borderRadius: 1,
                },
                "& .MuiInputLabel-root": {
                  color: "gray",
                },
              }}
            >
              {linguagens.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom>
              Dificuldade
            </Typography>
            <TextField
              fullWidth
              select
              name="dificuldade"
              value={formData.dificuldade}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#0f172a",
                  color: "white",
                  borderRadius: 1,
                },
                "& .MuiInputLabel-root": {
                  color: "gray",
                },
              }}
            >
              {dificuldades.map((dif) => (
                <MenuItem key={dif} value={dif}>
                  {dif}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom>
              Descrição
            </Typography>
            <TextField
              multiline
              minRows={5}
              fullWidth
              placeholder="Digite a descrição do exercício"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 4,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#0f172a",
                  borderRadius: 1,
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#6D6AF2", ":hover": { bgcolor: "#5755d9" } }}
              onClick={handleProximo}
              disabled={!formData.titulo}
            >
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Casos de Uso
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Adicionar caso de uso"
                name="casoDeUsoAtual"
                value={formData.casoDeUsoAtual}
                onChange={handleChange}
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    adicionarCasoDeUso();
                  }
                }}
              />
              <Button variant="contained" onClick={adicionarCasoDeUso}>
                +
              </Button>
            </Box>

            {formData.casosDeUso.length === 0 && (
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Nenhum caso de uso adicionado ainda.
              </Typography>
            )}

            <List dense>
              {formData.casosDeUso.map((caso, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removerCasoDeUso(i)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {caso}
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button variant="outlined" onClick={handleVoltar}>
                Voltar
              </Button>
              <Button variant="contained" onClick={handleFinalizar}>
                Finalizar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

