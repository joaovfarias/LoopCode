"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

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

  // Vai pra dentro 1B1C30
  // Vai pra fora 26273B

  return (
    <main className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#26273B] text-white p-8 gap-8">
      {/* Sidebar */}
      <section className="w-1/3 h-full bg-[#1B1C30] p-6 rounded-lg overflow-auto">
        <h1 className="text-2xl font-bold mb-2">Exercício: {id}</h1>
        <p className="text-sm text-gray-300 mb-2">
          Dificuldade: Fácil — Linguagem: Python
        </p>

        <div className="flex gap-2 mb-4">
          <span className="bg-blue-700 px-3 py-1 rounded-full text-sm">
            Fácil
          </span>
          <span className="bg-purple-700 px-3 py-1 rounded-full text-sm">
            Python
          </span>
        </div>

        <p className="text-sm mb-4">
          Given an array of integers nums and an integer target, return indices
          of the two numbers such that they add up to target.
          <br />
          <br />
          You may assume that each input would have exactly one solution, and
          you may not use the same element twice.
          <br />
          <br />
          You can return the answer in any order.
        </p>

        <h2 className="text-lg font-semibold mb-2">Exemplos</h2>
        <pre className="bg-[#212237] p-3 rounded text-sm">
          {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Input: nums = [3,2,4], target = 6
Output: [1,2]`}
        </pre>
      </section>

      {/* Code & Output Area */}
      <section className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
        {/* Editor */}
        <div className="bg-[#1B1C30] p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
          <h2 className="text-lg font-bold mb-2">Code</h2>
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
        </div>

        {/* Results / Inputs */}
        <div className="bg-[#1B1C30] p-4 rounded-lg">
          {/* Test case buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            {testCases.map((test, index) => (
              <Button
                key={index}
                variant={selectedCase === index ? "contained" : "outlined"}
                onClick={() => handleTestCaseSelect(index)}
                className="text-sm"
              >
                Caso {index + 1}
              </Button>
            ))}
          </div>

          {/* Inputs */}
          <div className="mb-4">
            <label className="block text-sm mb-1">nums</label>
            <input
              type="text"
              value={nums}
              onChange={(e) => setNums(e.target.value)}
              className="w-full bg-[#0f172a] p-2 rounded text-white border border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">target</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-[#0f172a] p-2 rounded text-white border border-gray-600"
            />
          </div>

          <Button
            onClick={handleRun}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Executar
          </Button>

          {/* Output */}
          <div className="mt-4">
            <label className="block text-sm mb-1">Output:</label>
            <pre className="bg-[#0f172a] p-2 rounded">{resultado}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
