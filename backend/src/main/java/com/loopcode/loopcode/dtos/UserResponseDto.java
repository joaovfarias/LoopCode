package com.loopcode.loopcode.dtos;

public record UserResponseDto(

    String username,
    String email,
    String role,
    int dailyStreak

) {}
