package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.security.JwtService;
import com.loopcode.loopcode.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Operações relacionadas a Auth*")
public class AuthController {

    private final AuthService authService;
    // private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        // this.jwtService = jwtService;
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

    @GetMapping("/me")
    @Operation(summary = "Validar token JWT", description = "Verifica se o token enviado no header é válido.")
    public ResponseEntity<Void> validateToken(Authentication authentication) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate")
    @Operation(summary = "Obter informações do usuário logado", description = "Retorna as informações do usuário logado.")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        UserResponseDto user = authService.getCurrentUser(authentication);
        return ResponseEntity.ok(user);
    }

    /*
     * /users/{username} -> Retorna informações do usuário
     * /users/{username}/exercises -> Retorna os exercícios do usuário
     * /users/{username}/lists -> Retorna as listas do usuário
     */

    /*
     * @GetMapping("/validate")
     * public ResponseEntity<Void> validateToken(HttpServletRequest request) {
     * String header = request.getHeader("Authorization");
     * if (header == null || !header.startsWith("Bearer ")) {
     * return ResponseEntity.status(401).build();
     * }
     * String token = header.substring(7);
     * boolean valid = jwtService.validateToken(token);
     * return valid
     * ? ResponseEntity.ok().build()
     * : ResponseEntity.status(401).build();
     */
    

}
