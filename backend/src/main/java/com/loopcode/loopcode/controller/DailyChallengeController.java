package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.service.DailyChallengeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.Authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/daily-challenge")
@Tag(name = "Daily-Challenge", description = "Endpoints do Desafio Diário")
public class DailyChallengeController {

    private final DailyChallengeService service;

    public DailyChallengeController(DailyChallengeService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Retorna o exercício do dia")
    public ResponseEntity<Exercise> getDailyChallenge() {
        return service.getDailyChallenge()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/resolve")
    @Operation(summary = "Marca o desafio como resolvido pelo usuário logado")
    public ResponseEntity<Void> resolveDaily(Authentication auth) {
        service.resolveDaily(auth.getName());
        return ResponseEntity.ok().build();
    }
}
