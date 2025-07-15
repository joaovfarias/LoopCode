package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.dtos.ExerciseRequestDto;
import com.loopcode.loopcode.service.ExerciseService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody ExerciseRequestDto dto,
            Authentication authentication) {

        String username = authentication.getName();
        Exercise created = exerciseService.createExercise(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);

    }

    @GetMapping
    public ResponseEntity<Page<Exercise>> getExercises(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Exercise> exercises = exerciseService.getExercises(
                language, difficulty, null, sortBy, order, page, size);
        return ResponseEntity.ok(exercises);
    }
}
