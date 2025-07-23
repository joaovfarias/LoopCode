"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Box, Typography, Button, Chip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CodeIcon from "@mui/icons-material/Code";
import CheckIcon from "@mui/icons-material/Check";

export default function ExercisePage({ params }) {
  const actualParams = React.use(params);
  const { id } = actualParams;

  const [resultado, setResultado] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [code, setCode] = useState("");
  const [nums, setNums] = useState("");
  const [caseResults, setCaseResults] = useState([]);

  const getExercise = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/exercises/${id}`, {
        method: "GET",
      });
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

  useEffect(() => {
    if (exercise?.mainCode) {
      const pattern = /def\s+[a-zA-Z_]\w*\s*\(.*?\):\n\t/;
      const match = exercise.mainCode.match(pattern);
      if (match) {
        setCode(match[0]);
      } else {
        console.warn("No match found in mainCode");
      }
    }
  }, [exercise]);

  useEffect(() => {
    if (exercise?.testCode?.length > 0) {
      setNums(exercise.testCode[0].input);
    }
  }, [exercise]);

  const testCases =
    exercise?.testCode?.map((test) => ({
      input: test.input,
      expectedOutput: test.expectedOutput,
    })) || [];

  const handleTestCaseSelect = (index) => {
    setSelectedCase(index);
    setNums(testCases[index].input);
    setResultado(caseResults[index]?.output || "");
  };

  const handleRun = async (e) => {
    e.preventDefault();
    setResultado("Executando...");
    setCaseResults([]);

    const extractBody = (code) => {
      const patternToRemove = /^def .*\(.*\):\n\t/;

      let modifiedString = code.replaceAll("\t", "    ");
      modifiedString = modifiedString.replaceAll("    ", "\t");
      modifiedString = modifiedString.replace(patternToRemove, "");

      return modifiedString;
    };

    const userCode = extractBody(code);

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
        body: JSON.stringify({ code: userCode }),
      });

      if (!response.ok) throw new Error("Erro ao executar o código");

      const data = await response.json();

      if (data.feedback === "Voce passou em todos os testes!") {
        setResultado(data.feedback);
        const passed = testCases.map((t) => ({
          status: "pass",
          output: t.expectedOutput,
        }));
        setCaseResults(passed);
      } else if (
        data.feedback === "Ocorreu um erro de compilacão ou execucão:"
      ) {
        setResultado(data.output);
      } else {
        setResultado(data.feedback);
      }
    } catch (err) {
      setResultado(`Erro: ${err.message}`);
    }
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
          {`${testCases
            .map((test, index) => {
              const inputStr = `Input: ${test.input}`;
              const result = caseResults[index];
              const outputLine = result?.output
                ? `Output: ${result.output}`
                : `Output: ${test.expectedOutput}`;
              return `${inputStr.padEnd(20)}${outputLine}`;
            })
            .join("\n")}`}
        </Box>
      </Box>

      {/* Code & Output Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
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
                  endIcon={
                    caseResults[index]?.status === "pass" ? (
                      <CheckIcon fontSize="small" />
                    ) : null
                  }
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

          <Typography variant="body2" sx={{ mb: 1 }}>
            Input:
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: "#0f172a",
              p: 1,
              borderRadius: 1,
              color: "white",
              mb: 1,
            }}
          >
            {nums}
          </Box>

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
