package com.loopcode.loopcode.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public record CreateUserListDto(
        @NotBlank String name,
        @NotEmpty List<UUID> exerciseIds) {
}
