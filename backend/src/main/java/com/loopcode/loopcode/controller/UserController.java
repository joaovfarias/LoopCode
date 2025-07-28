package com.loopcode.loopcode.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loopcode.loopcode.dtos.BanRequestDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.service.UserService;

import org.springframework.web.bind.annotation.RequestBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "User", description = "Operações relacionadas a usuários")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    @Operation  (summary = "Buscar usuário por nome de usuário", description = "Retorna os detalhes do usuário com base no nome de usuário fornecido.") 
    public ResponseEntity<UserResponseDto> getUserByUsername(@PathVariable String username) {
        UserResponseDto userResponse = userService.getUserByUsername(username);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/{username}/exercises")
    @Operation(summary = "Buscar exercícios criados pelo usuário", description = "Retorna todos os exercícios criados por um usuário específico.")
    public ResponseEntity<List<ExerciseResponseDto>> getExercisesByUsername(@PathVariable String username) {
        List<ExerciseResponseDto> exercises = userService.getExercisesByUsername(username);
        return ResponseEntity.ok(exercises);
    }

    @PatchMapping("/{username}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> banUser(@PathVariable String username, @RequestBody @Valid BanRequestDto banRequestDto){
        userService.banUser(username, banRequestDto);
        return ResponseEntity.ok("Usuário '" + username + "' banido com sucesso.");
    }

    @PatchMapping("/{username}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> unbanUser(@PathVariable String username){
        userService.unbanUser(username);
        return ResponseEntity.ok("Usuário '" + username + "' desbanido com sucesso.");
    }
}
