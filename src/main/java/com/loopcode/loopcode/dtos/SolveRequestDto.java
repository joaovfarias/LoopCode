package com.loopcode.loopcode.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SolveRequestDto(
                @NotBlank(message = "User code must not be blank") String userCode,
                @NotNull(message = "Inputs list must not be null") List<String> inputs,
                @NotBlank(message = "Language must not be blank") String language) {
}
