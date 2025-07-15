package com.loopcode.loopcode.dtos;

public record ExerciseRequestDto(
                String title,
                String language,
                String difficulty,
                String description,
                String mainCode,
                String testCode) {
}