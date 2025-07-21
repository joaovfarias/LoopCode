"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function CriarExercicioPage() {
  const [step, setStep] = useState(1);

  // Etapa 1 - Dados iniciais
  const [titulo, setTitulo] = useState("");
  const [linguagem, setLinguagem] = useState("");
  const [dificuldade, setDificuldade] = useState("");
  const [descricao, setDescricao] = useState("");

  const linguagens = ["JavaScript", "Python", "Java", "C++"];
  const dificuldades = ["Fácil", "Média", "Difícil"];

  // Etapa 2 - Importação
  const [codigoFile, setCodigoFile] = useState(null);
  const [exercicioFile, setExercicioFile] = useState(null);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0B0C1C",
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
          bgcolor: "#1A1B2E",
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
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Typography variant="h6" gutterBottom>
              Linguagem
            </Typography>
            <TextField
              select
              fullWidth
              value={linguagem}
              onChange={(e) => setLinguagem(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
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
              select
              fullWidth
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
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
              rows={4}
              fullWidth
              placeholder="Digite a descrição do exercício"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              sx={{
                mb: 4,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{ bgcolor: "#6D6AF2", ":hover": { bgcolor: "#5755d9" } }}
            >
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Importar código principal
            </Typography>
            <TextField
              fullWidth
              placeholder="Importar código principal"
              value={codigoFile?.name || ""}
              InputProps={{
                endAdornment: (
                  <IconButton component="label">
                    <UploadFileIcon sx={{ color: "#aaa" }} />
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setCodigoFile(e.target.files[0])}
                    />
                  </IconButton>
                ),
              }}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Importar exercício
            </Typography>
            <TextField
              fullWidth
              placeholder="Importar exercício"
              value={exercicioFile?.name || ""}
              InputProps={{
                endAdornment: (
                  <IconButton component="label">
                    <UploadFileIcon sx={{ color: "#aaa" }} />
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setExercicioFile(e.target.files[0])}
                    />
                  </IconButton>
                ),
              }}
              sx={{
                mb: 4,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{ bgcolor: "#6D6AF2" }}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#6D6AF2" }}
                onClick={() => {
                  console.log("Criar exercício!");
                  // aqui você pode fazer o upload ou salvar os dados
                }}
              >
                Criar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
