"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Divider,
} from "@mui/material";

export default function CreateExercisePage() {
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");

  const [testCases, setTestCases] = useState([]);
  const [argNames, setArgNames] = useState([]);
  const [functionName, setFunctionName] = useState("");
  const [argumentsList, setArgumentsList] = useState([
    { name: "", type: "Int" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  function ModifyMainCode(code) {
    console.log("Modifying main code:", code);

    const regex = /def\s+([a-zA-Z_]\w*)\s*\((.*)\):/;
    const foundMatch = code.match(regex);

    const functionName = foundMatch[1];
    const argNames = foundMatch[2];

    let finalCode = "import sys\nimport ast\n";

    const argumentsCount = argNames.split(",").map((p) => p.trim());

    argumentsCount.forEach((param, index) => {
      const argObj = argumentsList.find((a) => a.name === param);
      let parseLine = "";
      if (argObj) {
        if (argObj.type === "Int") {
          parseLine = `${param} = int(sys.argv[${index + 1}])`;
        } else if (argObj.type === "String") {
          parseLine = `${param} = sys.argv[${index + 1}]`;
        } else if (argObj.type === "Array") {
          parseLine = `${param} = ast.literal_eval(sys.argv[${index + 1}])`;
        }
      }
      finalCode += parseLine + "\n";
    });

    finalCode += `${code}\n\t{user_code}\n`;
    finalCode += `print(${functionName}(${argNames}))`;

    return finalCode;
  }

  const addArgument = () => {
    setArgumentsList([...argumentsList, { name: "", type: "Int" }]);
  };

  const updateArgumentName = (index, newName) => {
    const updated = [...argumentsList];
    updated[index].name = newName;
    setArgumentsList(updated);
  };

  const updateArgumentType = (index, newType) => {
    const updated = [...argumentsList];
    updated[index].type = newType;
    setArgumentsList(updated);
  };

  const removeArgument = (index) => {
    const updated = [...argumentsList];
    updated.splice(index, 1);
    setArgumentsList(updated);
  };

  const generateFunctionHeader = () => {
    const args = argumentsList
      .filter((arg) => arg.name.trim() !== "")
      .map((arg) => arg.name)
      .join(", ");
    return `def ${functionName}(${args}):`;
  };

  const extractArguments = (code) => {
    const match = code.match(/def\s+\w+\s*\((.*?)\)/);
    if (!match) return [];
    return match[1]
      .split(",")
      .map((arg) => arg.trim())
      .filter(Boolean);
  };

  const addTestCase = () => {
    const funHeader = generateFunctionHeader();
    const args = extractArguments(funHeader);
    const regex = /def\s+([a-zA-Z_]\w*)\s*\((.*)\):/;

    if (args.length === 0 || !regex.test(funHeader)) {
      setErrorMessage("Função inválida ou não definida.");
      return;
    }

    setErrorMessage("");
    setArgNames(args);

    const updatedCases = testCases.map((test) => {
      const newInputs = {};
      args.forEach((arg) => {
        newInputs[arg] = test.inputs[arg] ?? "";
      });
      return {
        inputs: newInputs,
        expectedOutput: test.expectedOutput,
        argNames: args,
      };
    });

    const newInputs = {};
    args.forEach((arg) => {
      newInputs[arg] = "";
    });

    const newTestCase = {
      inputs: newInputs,
      expectedOutput: "",
      argNames: args,
    };

    setTestCases([...updatedCases, newTestCase]);
  };

  const handleInputChange = (index, key, value) => {
    const updated = [...testCases];
    updated[index].inputs[key] = value;
    setTestCases(updated);
  };

  const handleOutputChange = (index, value) => {
    const updated = [...testCases];
    updated[index].expectedOutput = value;
    setTestCases(updated);
  };

  const removeTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  const difficulties = ["Easy", "Medium", "Hard"];

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
          maxWidth: 700,
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
              }}
            />

            <Typography variant="h6" gutterBottom>
              Linguagem
            </Typography>
            <TextField
              fullWidth
              value="Python"
              InputProps={{ readOnly: true }}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
              }}
            />

            <Typography variant="h6" gutterBottom>
              Dificuldade
            </Typography>
            <Box sx={{ mb: 3 }}>
              <RadioGroup
                row
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {difficulties.map((dif) => (
                  <FormControlLabel
                    key={dif}
                    value={dif}
                    control={<Radio sx={{ color: "white" }} />}
                    label={dif}
                    sx={{
                      color: "white",
                      "& .MuiRadio-root": { color: "white" },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>

            <Typography variant="h6" gutterBottom>
              Descrição
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Digite a descrição do exercício"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 4,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={
                title.trim() === "" ||
                description.trim() === "" ||
                difficulty.trim() === ""
              }
              sx={{ bgcolor: "#6D6AF2", ":hover": { bgcolor: "#5755d9" } }}
            >
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Box mt={3}>
              <Divider sx={{ mb: 3, mt: -3 }}>Visualização da Função</Divider>
              <Box
                sx={{
                  mt: 1,
                  mb: 2,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  fontFamily: "monospace",
                }}
              >
                {generateFunctionHeader()}
              </Box>
            </Box>

            <Divider sx={{ mb: 3, mt: 3 }}>Definição da Função</Divider>

            <Box>
              <TextField
                label="Nome"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                sx={{ mb: 2 }}
              />

              {argumentsList.map((arg, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <TextField
                    label={`Parâmetro`}
                    value={arg.name}
                    onChange={(e) => updateArgumentName(index, e.target.value)}
                  />
                  <TextField
                    label="Tipo"
                    select
                    value={arg.type}
                    onChange={(e) => updateArgumentType(index, e.target.value)}
                    sx={{ width: 120 }}
                  >
                    <MenuItem value="Int">Integer</MenuItem>
                    <MenuItem value="String">String</MenuItem>
                    <MenuItem value="Array">Array</MenuItem>
                  </TextField>
                  <Button
                    color="error"
                    onClick={() => removeArgument(index)}
                    disabled={index === 0}
                  >
                    Remove
                  </Button>
                </Box>
              ))}

              <Button
                variant="contained"
                onClick={addArgument}
                sx={{ mb: 2, mt: 2 }}
              >
                + Adicionar Parâmetro
              </Button>
            </Box>

            <Divider sx={{ mb: 3, mt: 2 }}>Casos de Teste</Divider>

            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={addTestCase} sx={{ mt: 1 }}>
                + Adicionar Caso de Teste
              </Button>
            </Box>
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 1, mb: 3, width: "100%" }}>
                {errorMessage}
              </Alert>
            )}

            {testCases.map((test, index) => (
              <Box
                key={index}
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 2,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Typography variant="subtitle2">Caso {index + 1}</Typography>
                  <Button
                    color="error"
                    onClick={() => removeTestCase(index)}
                    sx={{ minWidth: "auto", p: 0 }}
                  >
                    Remover
                  </Button>
                </Box>
                {(test.argNames || []).map((arg) => (
                  <TextField
                    key={arg}
                    label={arg}
                    value={test.inputs[arg] ?? ""}
                    onChange={(e) =>
                      handleInputChange(index, arg, e.target.value)
                    }
                    sx={{ m: 1 }}
                  />
                ))}
                <TextField
                  label="Saída esperada"
                  value={test.expectedOutput}
                  onChange={(e) => handleOutputChange(index, e.target.value)}
                  sx={{ m: 1 }}
                />
              </Box>
            ))}

            <Box display="flex" justifyContent="space-between" mt={6}>
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
                onClick={async () => {
                  if (testCases.length === 0) {
                    alert("Adicione pelo menos um caso de teste.");
                    return;
                  }

                  const formattedTestCases = testCases.map((test) => ({
                    input: (test.argNames || [])
                      .map((arg) => test.inputs[arg])
                      .join(", "),
                    expectedOutput: test.expectedOutput,
                  }));

                  const requestBody = {
                    title,
                    description,
                    mainCode: ModifyMainCode(String(generateFunctionHeader())),
                    difficulty: difficulty.toUpperCase(),
                    languageId: 2,
                    testCases: formattedTestCases,
                  };

                  console.log("Request body:", requestBody);

                  try {
                    const response = await fetch(`${baseUrl}/exercises`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: JSON.stringify(requestBody),
                    });

                    if (!response.ok)
                      throw new Error("Error creating exercise");

                    const created = await response.json();
                    alert("Exercicio criado com sucesso!");
                  } catch (err) {
                    console.error(err);
                    alert("Falha ao criar exercício.");
                  }
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
