package com.loopcode.loopcode.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExerciseResponseDto(
    UUID id,
    String title,
    LanguageDto language,
    String difficulty,
    String description,
    SimpleUserDto createdBy,
    boolean verified,
    LocalDateTime createdAt
) {}
