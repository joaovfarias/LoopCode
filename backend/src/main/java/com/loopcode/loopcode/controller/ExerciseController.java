package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.solved_exercise.SolvedExercise;
import com.loopcode.loopcode.dtos.ExerciseRequestDto;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.SolveRequestDto;
import com.loopcode.loopcode.dtos.SolveResponseDto;
import com.loopcode.loopcode.service.ExerciseService;
import com.loopcode.loopcode.service.SolvedExerciseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exercises")
@Tag(name = "Exercicios", description = "Endpoint dos exercicios")
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final SolvedExerciseService solvedExerciseService;

    public ExerciseController(ExerciseService exerciseService, SolvedExerciseService solvedExerciseService) {
        this.exerciseService = exerciseService;
        this.solvedExerciseService = solvedExerciseService;
    }

    @PostMapping
    @Operation(summary = "Criar um novo exercício", description = "Cria um novo exercício e retorna o objeto criado.")
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody ExerciseRequestDto dto,
            Authentication authentication) {

        String username = authentication.getName();
        Exercise created = exerciseService.createExercise(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);

    }

    @GetMapping
    @Operation(summary = "Retorna exercícios (paginado)", description = "Retorna uma pagina de exercicios recebendo como paramêtro a linguagem, tipo de sort e etc...")
    public ResponseEntity<Page<ExerciseResponseDto>> getExercises(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false, defaultValue = "null") String solved,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ExerciseResponseDto> exercisesDtoPage = exerciseService.getExercises(
                language, difficulty, solved, sortBy, order, page, size);
        return ResponseEntity.ok(exercisesDtoPage);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um exercicio por ID", description = "Retorna os detalhes de um exercicio especifico")
    public ResponseEntity<ExerciseResponseDto> getExerciseById(@PathVariable UUID id) {
        ExerciseResponseDto exerciseDto = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exerciseDto);
    }

    @PostMapping("/{id}/solve")
    @Operation(summary = "Submete uma solução para um exercício e marca como resolvido.", description = "Executa o código do usuário contra os casos de teste e retorna o resultado.")
    public ResponseEntity<SolveResponseDto> solveExercise(
            @PathVariable UUID id,
            @RequestBody @Valid SolveRequestDto solveDto,
            Authentication authentication) {
        String username = authentication.getName();

        SolveResponseDto response = exerciseService.solveExercise(id, solveDto, username);

        if (response.passed()) {
            solvedExerciseService.markAsSolved(username, id);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/upvote")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Vota positivamente em um exercício (Funciona como Toggle)", description = "Permite que um usuário vote positivamente em um exercício.")
    public ResponseEntity<Void> upvote(@PathVariable UUID id) {
        exerciseService.toggleVote(id,
                SecurityContextHolder.getContext().getAuthentication().getName(),
                true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/downvote")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Vota negativamente em um exercício (Funciona como Toggle)", description = "Permite que um usuário vote negativamente em um exercício.")
    public ResponseEntity<Void> downvote(@PathVariable UUID id) {
        exerciseService.toggleVote(id,
                SecurityContextHolder.getContext().getAuthentication().getName(),
                false);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasRole('MOD') or hasRole('ADMIN')")
    public ResponseEntity<Void> verify(@PathVariable UUID id) {
        exerciseService.verifyExercise(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ExerciseResponseDto>> search(
            @RequestParam String q,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "votes") String sortBy,
            @RequestParam(defaultValue = "desc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ExerciseResponseDto> result = exerciseService.searchExercises(
            q, language, difficulty, sortBy, order, page, size);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar um exercício", description = "Remove um exercício e suas dependências do banco de dados. Apenas administradores podem deletar exercícios.")
    public ResponseEntity<Void> deleteExercise(@PathVariable UUID id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }
}
