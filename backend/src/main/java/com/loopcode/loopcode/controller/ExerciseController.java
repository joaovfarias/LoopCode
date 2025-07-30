package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.dtos.ExerciseRequestDto;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.SolveRequestDto;
import com.loopcode.loopcode.dtos.SolveResponseDto;
import com.loopcode.loopcode.service.ExerciseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exercises")
@Tag(name = "Exercicios/Atividades", description = "Endpoint dos exercicios")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping
    @Operation(summary = "Cria exercicio", description = "Recebe de parametro o Dto do exercicio e retorna o exercicio criado")
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody ExerciseRequestDto dto,
            Authentication authentication) {

        String username = authentication.getName();
        Exercise created = exerciseService.createExercise(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);

    }

    @GetMapping
    @Operation(summary = "Retorna exercícios paginados", description = "Retorna uma pagina de exercicios recebendo como paramêtro a linguagem, tipo de sort e etc...")
    public ResponseEntity<Page<ExerciseResponseDto>> getExercises(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ExerciseResponseDto> exercisesDtoPage = exerciseService.getExercises(
                language, difficulty, sortBy, order, page, size);
        return ResponseEntity.ok(exercisesDtoPage);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um exercicio por ID", description = "Retorna os detalhes de um exercicio especifico")
    public ResponseEntity<ExerciseResponseDto> getExerciseById(@PathVariable UUID id) {
        ExerciseResponseDto exerciseDto = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exerciseDto);
    }

    @PostMapping("/{id}/solve")
    @Operation(summary = "Submete uma solução para um exercício", description = "Executa o código do usuário contra os casos de teste e retorna o resultado.")
    public ResponseEntity<SolveResponseDto> solveExercise(
            @PathVariable UUID id,
            @RequestBody @Valid SolveRequestDto solveDto,
            Authentication authentication) {
        String username = authentication.getName();

        SolveResponseDto response = exerciseService.solveExercise(id, solveDto, username);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable UUID id, Authentication auth) {
        exerciseService.vote(id, auth.getName(), true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<Void> downvote(@PathVariable UUID id, Authentication auth) {
        exerciseService.vote(id, auth.getName(), false);
        return ResponseEntity.ok().build();
    }

}
