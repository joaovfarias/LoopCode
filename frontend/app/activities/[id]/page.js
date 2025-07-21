"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CodeIcon from "@mui/icons-material/Code";

export default function ExercisePage({ params }) {
  const actualParams = React.use(params);
  const { id } = actualParams;

  const [nums, setNums] = useState("2, 7, 11, 15");
  const [target, setTarget] = useState("9");
  const [resultado, setResultado] = useState("");
  const [selectedCase, setSelectedCase] = useState(0);

  const getExercise = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/exercises/${id}`, {
        method: "GET",
      });
      // if (!response.ok) throw new Error("Erro ao buscar exercício");
      if (!response.ok) {
        window.location.href = "/not-found";
      }
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const [exercise, setExercise] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getExercise(id);
      if (data) {
        setExercise(data);
      } else {
        setExercise(null);
      }
    };
    fetchData();
  }, [id]);

  const [code, setCode] = useState(`No data to display yet.`);

  const testCases = [
    // Example test cases
  ];

  const handleRun = async (e) => {
    e.preventDefault();
    setResultado("Executando...");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const response = await fetch(`${baseUrl}/exercises/${id}/solve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) throw new Error("Erro ao executar o código");

      const data = await response.json();

      if (data.feedback === "Ocorreu um erro de compilacão ou execucão:") {
        setResultado(data.output);
      } else {
        setResultado(data.feedback || "Nenhum resultado retornado");
      }
    } catch (err) {
      setResultado(`Erro: ${err.message}`);
    }
  };

  const handleTestCaseSelect = (index) => {
    // Set the selected test case
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        width: "100%",
        overflow: "hidden",
        color: "white",
        gap: 4,
        p: 4,
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: "33%",
          height: "100%",
          bgcolor: "card.primary",
          p: 3,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Exercício: {exercise ? exercise.title : "Carregando..."}
        </Typography>

        <Typography variant="body2" color="gray" gutterBottom>
          Dificuldade: {exercise ? exercise.difficulty : "Carregando..."} —
          Linguagem: {exercise ? exercise.language.name : "Carregando..."}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Chip
            label={exercise ? exercise.difficulty : "Carregando..."}
            sx={{ bgcolor: "#3B82F6", color: "white" }}
          />
          <Chip
            label={exercise ? exercise.language.name : "Carregando..."}
            sx={{ bgcolor: "#8B5CF6", color: "white" }}
          />
        </Box>

        <Typography variant="body2" paragraph>
          {exercise ? exercise.description : "Carregando descrição..."}
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Exemplos
        </Typography>

        <Box
          component="pre"
          sx={{
            bgcolor: "#212237",
            p: 2,
            borderRadius: 1,
            fontSize: "0.875rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {`Exemplos de Entrada e Saída:`}
        </Box>
      </Box>

      {/* Code & Output Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Editor */}
        <Box
          sx={{
            bgcolor: "card.primary",
            p: 2,
            borderRadius: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CodeIcon />
            <Typography variant="h6" fontWeight="bold">
              Code
            </Typography>
          </Box>
          <Editor
            height="100%"
            language="python"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </Box>

        {/* Results / Inputs */}
        <Box sx={{ bgcolor: "card.primary", p: 2, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {testCases.map((test, index) => (
                <Button
                  key={index}
                  size="small"
                  variant={selectedCase === index ? "contained" : "outlined"}
                  onClick={() => handleTestCaseSelect(index)}
                >
                  Caso {index + 1}
                </Button>
              ))}
            </Box>
            <Button
              onClick={handleRun}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Executar
            </Button>
          </Box>

          <TextField
            label="nums"
            fullWidth
            value={nums}
            onChange={(e) => setNums(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
              input: { color: "white" },
              "& label": { color: "gray" },
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0f172a",
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="target"
            fullWidth
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              mb: 3,
              input: { color: "white" },
              "& label": { color: "gray" },
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0f172a",
                borderRadius: 1,
              },
            }}
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Output:
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: "#0f172a",
                p: 2,
                borderRadius: 1,
                color: "white",
              }}
            >
              {resultado}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
