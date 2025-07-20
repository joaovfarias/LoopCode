package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.service.ExerciseService;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
