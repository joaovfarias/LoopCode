"use client";

import React, { useState } from "react";
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

  const [code, setCode] = useState(
    `class Solution(object):
    def twoSum(self, nums, target):
        # type nums: List[int]
        # type target: int
        # type: List[int]
        pass`
  );

  const testCases = [
    { nums: "2, 7, 11, 15", target: "9" },
    { nums: "3, 2, 4", target: "6" },
    { nums: "1, 5, 3", target: "6" },
    { nums: "0, 4, 3, 0", target: "0" },
  ];

  const handleRun = () => {
    const numArray = nums.split(",").map((n) => parseInt(n.trim()));
    const t = parseInt(target);

    const indices = new Map();
    for (let i = 0; i < numArray.length; i++) {
      const complement = t - numArray[i];
      if (indices.has(complement)) {
        setResultado(`[${indices.get(complement)}, ${i}]`);
        return;
      }
      indices.set(numArray[i], i);
    }

    setResultado("Sem solução");
  };

  const handleTestCaseSelect = (index) => {
    const testCase = testCases[index];
    setSelectedCase(index);
    setNums(testCase.nums);
    setTarget(testCase.target);
    setResultado("");
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
          Exercício: {id}
        </Typography>

        <Typography variant="body2" color="gray" gutterBottom>
          Dificuldade: Fácil — Linguagem: Python
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Chip label="Fácil" sx={{ bgcolor: "#3B82F6", color: "white" }} />
          <Chip label="Python" sx={{ bgcolor: "#8B5CF6", color: "white" }} />
        </Box>

        <Typography variant="body2" paragraph>
          Given an array of integers nums and an integer target, return indices
          of the two numbers such that they add up to target.
          <br />
          <br />
          You may assume that each input would have exactly one solution, and
          you may not use the same element twice.
          <br />
          <br />
          You can return the answer in any order.
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
          {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Input: nums = [3,2,4], target = 6
Output: [1,2]`}
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
