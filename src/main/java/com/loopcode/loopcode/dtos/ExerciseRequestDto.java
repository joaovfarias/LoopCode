package com.loopcode.loopcode.dtos;

import java.util.List;

public record ExerciseRequestDto(
                String title,
                String description,
                String mainCode,
                String difficulty, // "EASY", "MEDIUM", "HARD"
                Long languageId,
                List<TestCaseDto> testCases
) {}
