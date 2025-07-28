package com.loopcode.loopcode.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loopcode.loopcode.dtos.BanRequestDto;
import com.loopcode.loopcode.service.UserService;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Tag(name = "User", description = "Operações relacionadas a usuários")
public class UserController {

    @Autowired
    private UserService userService;

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
