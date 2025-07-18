package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Operações relacionadas a Auth*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar novo usuário", description = "Não retorna nada, se funcionar, o novo usuário foi registrado.")
    public void register(@Valid @RequestBody RegisterRequestDto requestDto) {
        authService.register(requestDto);
    }

    @PostMapping("/login")
    @Operation(summary = "Loga o usuário", description = "Loga um usuário e retorna o token JWT dele.")
    public ResponseEntity<AuthResponseDto> login(@RequestBody @Valid LoginRequestDto requestDto) {
        AuthResponseDto response = authService.login(requestDto);
        return ResponseEntity.ok(response);
    }
}