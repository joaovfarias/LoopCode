"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Box, Typography, Button, Chip, Snackbar, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CodeIcon from "@mui/icons-material/Code";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ExercicioItem from "@/components/ExercicioItem";
import CalculateIcon from "@mui/icons-material/Calculate";
import { VerifiedUserRounded, GppBadRounded } from "@mui/icons-material";

export default function ExercisePage({ params }) {
  const actualParams = React.use(params);
  const { id } = actualParams;

  const [resultado, setResultado] = useState("");
  const [selectedCase, setSelectedCase] = useState(0);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [caseExampleResults, setCaseExampleResults] = useState([]);
  const [caseResults, setCaseResults] = useState([]);
  const [caseStates, setCaseStates] = useState([]);
  const [exercise, setExercise] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");
  const handleVote = async (exerciseId, type) => {
    try {
      const response = await fetch(
        `${baseUrl}/exercises/${exerciseId}/${type}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        console.error("Erro ao votar");
        return;
      }
      updateVoteLocalmente(type);
    } catch (error) {
      console.error("Erro na requisição de voto:", error);
    }
  };

  const updateVoteLocalmente = (type) => {
    setExercise((ex) => {
      if (!ex) return ex;

      const currentVote = ex.userVote; // 1, 0 ou -1
      let delta = 0;
      let newVote = currentVote;

      if (type === "upvote") {
        if (currentVote === 1) {
          // remove upvote
          delta = -1;
          newVote = 0;
        } else if (currentVote === -1) {
          // troca down para up
          delta = 2;
          newVote = 1;
        } else {
          // vota up pela primeira vez
          delta = 1;
          newVote = 1;
        }
      } else if (type === "downvote") {
        if (currentVote === -1) {
          // remove downvote
          delta = 1;
          newVote = 0;
        } else if (currentVote === 1) {
          // troca up para down
          delta = -2;
          newVote = -1;
        } else {
          // vota down pela primeira vez
          delta = -1;
          newVote = -1;
        }
      }

      return {
        ...ex,
        voteCount: ex.voteCount + delta,
        userVote: newVote,
      };
    });
  };

  const getExercise = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/exercises/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
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

  const getErrorLine = (errorLog) => {
    if (!errorLog) return "";

    const lines = errorLog.trim().split("\n");

    if (lines.length === 0) return "";
    if (lines.length - 1 < 0) return "";

    return lines[lines.length - 1];
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExercise(id);
      if (data) {
        setExercise(data);
        console.log(data);
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
    if (exercise?.testCode?.length > 0) {
      setCaseStates(Array(exercise.testCode.length).fill(null));
    }
  }, [exercise]);

  useEffect(() => {
    if (exercise?.testCode?.length > 0) {
      setInput(exercise.testCode[0].input);
    }
  }, [exercise]);

  const testCases =
    exercise?.testCode?.map((test) => ({
      input: test.input,
      expectedOutput: test.expectedOutput,
    })) || [];

  const handleTestCaseSelect = (index) => {
    setSelectedCase(index);
    setInput(testCases[index].input);
    setResultado(getErrorLine(caseResults[index]?.output || ""));
  };

  const handleRun = async (e) => {
    e.preventDefault();
    setResultado("Executando...");
    setCaseResults([]);
    setCaseStates(Array(testCases.length).fill(null));

    const extractBody = (code) => {
      let modifiedString = code;
      const patternToRemove = /^def .*\(.*\):\n\t/;

      modifiedString = modifiedString.replaceAll("\r", "");
      modifiedString = modifiedString.replaceAll("\t", "    ");
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

      console.log(JSON.stringify({ code: userCode }));

      if (!response.ok) throw new Error("Erro ao executar o código");

      const data = await response.json();

      setCaseResults(
        data.output.map((result) => ({
          output: result.output,
          expectedOutput: result.expectedOutput,
          passed: result.passed,
        }))
      );
      setResultado(getErrorLine(data.output[selectedCase]?.output || ""));

      setCaseStates((prev) => {
        const newStates = Array(data.output.length).fill(null);
        data.output.forEach((result, idx) => {
          newStates[idx] = result.passed ? "passed" : "failed";
        });
        return newStates;
      });

      const allPassed = data.output.every((result) => result.passed);

      if (allPassed) {
        setShowSuccessSnackbar(true);
      }

      const dailyChallenge = await fetch(`${baseUrl}/daily-challenge`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (dailyChallenge.status === 404) {
        console.log("Desafio diário não encontrado.");
        return;
      }

      const dailyChallengeData = await dailyChallenge.json();

      if (dailyChallenge.ok && allPassed) {
        if (dailyChallengeData.id === exercise.id) {
          try {
            const response = await fetch(`${baseUrl}/daily-challenge/resolve`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              if (response.status === 500) {
                console.log("Desafio diário já resolvido anteriormente.");
              } else {
                throw new Error("Erro ao resolver o desafio diário");
              }
            }
          } catch (err) {
            console.error("Erro ao resolver o desafio diário:", err);
          }
        }
      }
    } catch (err) {
      setResultado(`Erro: ${err.message}`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 72px)",
        width: "100%",
        overflow: "hidden",
        color: "white",
        gap: 4,
        py: 4,
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
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            mb: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 1, wordBreak: "break-word" }}
            >
              {exercise ? exercise.title : "Carregando..."}
            </Typography>
            <Typography variant="body2" color="gray">
              Criado por{" "}
              {exercise ? (
                <a
                  href={`/users/${exercise.createdBy.username}`}
                  style={{
                    color: "#8B5CF6",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  {exercise.createdBy.username}
                </a>
              ) : (
                "Carregando..."
              )}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <ExercicioItem
              exercicio={exercise}
              onUpvote={() => handleVote(exercise.id, "upvote")}
              onDownvote={() => handleVote(exercise.id, "downvote")}
              onlyVotes={true}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2, mt: 1 }}>
          <Chip
            size="small"
            icon={<CalculateIcon />}
            label={
              exercise
                ? exercise.difficulty.charAt(0) +
                  exercise.difficulty.slice(1).toLowerCase()
                : "Carregando..."
            }
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
          />
          <Chip
            size="small"
            icon={<CodeIcon />}
            label={exercise ? exercise.language.name : "Carregando..."}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
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
            p: 2,
            borderRadius: 2,
            fontSize: "0.875rem",
            whiteSpace: "pre-wrap",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {`${testCases
            .map((test, index) => {
              const inputStr = `Input: ${test.input}`;
              const result = caseExampleResults[index];
              const outputLine = result?.output
                ? `Output: ${result.output}`
                : `Output: ${test.expectedOutput}`;
              return `${inputStr}\n${outputLine}`;
            })
            .join("\n\n")}`}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CodeIcon />
              <Typography variant="h6" fontWeight="bold">
                Code
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={
                exercise?.verified ? <VerifiedUserRounded /> : <GppBadRounded />
              }
              label={exercise?.verified ? "Verificado" : "Não verificado"}
              sx={{
                bgcolor: exercise?.verified ? "success.main" : "error.main",
                fontSize: "0.75rem",
                paddingLeft: 0.3,
                paddingRight: 0.3,
                marginRight: 0,
              }}
            />
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
                    caseStates[index] === "passed" ? (
                      <CheckIcon fontSize="small" />
                    ) : caseStates[index] === "failed" ? (
                      <CloseIcon fontSize="small" />
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
              border: "1px solid rgba(255, 255, 255, 0.1)",
              p: 1,
              borderRadius: 1,
              color: "white",
              mb: 1,
            }}
          >
            {input}
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Output:
            </Typography>
            <Box
              component="pre"
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                p: 1,
                borderRadius: 1,
                color: "white",
                height: "40px",
              }}
            >
              {resultado}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          sx={{
            width: "100%",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          Você passou em todos os casos de teste!
        </Alert>
      </Snackbar>
    </Box>
  );
}
