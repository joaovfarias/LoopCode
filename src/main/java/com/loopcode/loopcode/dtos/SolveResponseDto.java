package com.loopcode.loopcode.dtos;

public record SolveResponseDto(
                String output,
                boolean passed,
                String feedback,
                String expectedOutput) {
}
