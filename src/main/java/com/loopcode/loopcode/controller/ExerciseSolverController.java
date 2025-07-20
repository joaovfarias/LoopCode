package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.SolveRequestDto;
import com.loopcode.loopcode.dtos.SolveResponseDto;
import com.loopcode.loopcode.service.ExerciseService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/exercises")
public class ExerciseSolverController {

    private final ExerciseService exerciseService;

    public ExerciseSolverController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    /*
    @PostMapping("/{id}/solve")
    public ResponseEntity<SolveResponseDto> solveExercise(
            @PathVariable("id") UUID exerciseId,
            @RequestBody @Valid SolveRequestDto requestDto,
            Authentication authentication) {

        String username = authentication.getName();
        SolveResponseDto result = exerciseService.solve(
                exerciseId,
                requestDto.userCode(),
                requestDto.inputs(),
                requestDto.language(),
                username);
        return ResponseEntity.ok(result);
    }*/
}
