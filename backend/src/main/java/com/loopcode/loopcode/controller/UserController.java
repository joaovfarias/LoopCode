package com.loopcode.loopcode.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.loopcode.loopcode.dtos.BanRequestDto;
import com.loopcode.loopcode.dtos.BanRecordResponseDto;
import com.loopcode.loopcode.dtos.TimeoutRequestDto;
import com.loopcode.loopcode.dtos.TimeoutRecordResponseDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.service.UserService;

import org.springframework.web.bind.annotation.RequestBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;

@RestController
@RequestMapping("/users")
@Tag(name = "User", description = "Operações relacionadas a usuários")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    @Operation(summary = "Buscar usuário por nome de usuário", description = "Retorna os detalhes do usuário com base no nome de usuário fornecido.")
    public ResponseEntity<UserResponseDto> getUserByUsername(@PathVariable String username) {
        UserResponseDto userResponse = userService.getUserByUsername(username);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/{username}/exercises")
    @Operation(summary = "Buscar exercícios criados pelo usuário (paginado)", description = "Retorna os exercícios paginados criados por um usuário específico.")
    public ResponseEntity<Page<ExerciseResponseDto>> getExercisesByUsername(
            @PathVariable String username,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<ExerciseResponseDto> exercises = userService.getExercisesByUsername(username, pageable);
        return ResponseEntity.ok(exercises);
    }

    @PatchMapping("/{username}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> banUser(@PathVariable String username,
            @RequestBody @Valid BanRequestDto banRequestDto) {
        userService.banUser(username, banRequestDto);
        return ResponseEntity.ok("Usuário '" + username + "' banido com sucesso.");
    }

    @PatchMapping("/{username}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> unbanUser(@PathVariable String username) {
        userService.unbanUser(username);
        return ResponseEntity.ok("Usuário '" + username + "' desbanido com sucesso.");
    }

    @PatchMapping("/{username}/timeout")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> applyTimeout(@PathVariable String username,
            @RequestBody @Valid TimeoutRequestDto timeoutRequestDto) {
        userService.applyTimeout(username, timeoutRequestDto);
        return ResponseEntity.ok("Timeout de " + timeoutRequestDto.getDurationMinutes() +
                " minutos aplicado ao usuário '" + username + "'.");
    }

    @PatchMapping("/{username}/untimeout")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> clearTimeout(@PathVariable String username) {
        userService.removeTimeout(username);
        return ResponseEntity.ok("Timeout do usuário '" + username + "' removido com sucesso.");
    }

    @PatchMapping("/{username}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Altera o papel (role) de um usuário", description = "Somente ADMIN pode promover/demover usuários.")

    public ResponseEntity<Void> changeRole(
            @PathVariable String username,
            @RequestParam("role") String role) {
        userService.changeRole(username, role);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MOD')")
    @Operation(summary = "Buscar usuários por role com paginação", description = "Retorna usuários filtrados por role com suporte a paginação.")
    public ResponseEntity<Page<UserResponseDto>> getUsers(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "role", required = false) String role) {

        Page<UserResponseDto> result = userService.getUsersByRole(page, size, role);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bans")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MOD')")
    @Operation(summary = "Buscar registros de banimento com paginação", description = "Retorna registros de banimento com suporte a paginação e filtros.")
    public ResponseEntity<Page<BanRecordResponseDto>> getBanRecords(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "active", required = false) Boolean active) {

        Page<BanRecordResponseDto> result = userService.getBanRecords(page, size, active);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/timeouts")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MOD')")
    @Operation(summary = "Buscar registros de timeout com paginação", description = "Retorna registros de timeout com suporte a paginação e filtros.")
    public ResponseEntity<Page<TimeoutRecordResponseDto>> getTimeoutRecords(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "active", required = false) Boolean active) {

        Page<TimeoutRecordResponseDto> result = userService.getTimeoutRecords(page, size, active);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MOD')")
    @Operation(summary = "Buscar usuários por nome de usuário ou email", description = "Retorna usuários que correspondem ao termo de busca com suporte a paginação.")
    public ResponseEntity<Page<UserResponseDto>> searchUsers(
            @RequestParam("q") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<UserResponseDto> result = userService.searchUsers(query, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bans/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MOD')")
    @Operation(summary = "Buscar registros de banimento por nome de usuário ou email", description = "Retorna registros de banimento que correspondem ao termo de busca com suporte a paginação.")
    public ResponseEntity<Page<BanRecordResponseDto>> searchBanRecords(
            @RequestParam("q") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<BanRecordResponseDto> result = userService.searchBanRecords(query, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/timeouts/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MOD')")
    @Operation(summary = "Buscar registros de timeout por nome de usuário ou email", description = "Retorna registros de timeout que correspondem ao termo de busca com suporte a paginação.")
    public ResponseEntity<Page<TimeoutRecordResponseDto>> searchTimeoutRecords(
            @RequestParam("q") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<TimeoutRecordResponseDto> result = userService.searchTimeoutRecords(query, page, size);
        return ResponseEntity.ok(result);
    }

}
