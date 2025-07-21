package com.loopcode.loopcode.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SolveRequestDto(
                @NotBlank(message = "User code must not be blank") String code
                ) {
}
