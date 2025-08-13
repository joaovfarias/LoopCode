package com.loopcode.loopcode.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.loopcode.loopcode.domain.exercise.TestCase;

public record ExerciseResponseDto(
                UUID id,
                String title,
                LanguageDto language,
                String difficulty,
                String description,
                SimpleUserDto createdBy,
                boolean verified,
                LocalDateTime createdAt,
                String mainCode,
                List<TestCase> testCode,
                int voteCount,
                int upvotes,
                int downvotes,
                int userVote,
                boolean solved

) {
}
