package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.CreateUserListDto;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.service.UserListService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "UserLists", description = "Operações com listas de exercícios do usuário")
public class UserListController {

    private final UserListService listService;

    public UserListController(UserListService listService) {
        this.listService = listService;
    }

    @PostMapping("/users/{username}/lists")
    @PreAuthorize("#username == authentication.name")
    @Operation(summary = "Cria uma nova lista de exercícios")
    public ResponseEntity<UserListDto> create(
            @PathVariable String username,
            @RequestBody @Valid CreateUserListDto dto) {
        var created = listService.createList(username, dto);
        return ResponseEntity.status(201).body(created);

    }

    @GetMapping("/users/{username}/lists")
    @PreAuthorize("#username == authentication.name")
    @Operation(summary = "Obtém listas de um usuário tal")
    public ResponseEntity<Page<UserListDto>> listsByUsername(
            @PathVariable String username,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserListDto> lists = listService.getListsByUsername(username, pageable);
        return ResponseEntity.ok(lists);
    }

    @GetMapping("/lists")
    @Operation(summary = "Retorna todas as listas de todos os usuários (paginado)")
    public ResponseEntity<Page<UserListDto>> allPublicLists(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserListDto> lists = listService.getAllLists(pageable);
        return ResponseEntity.ok(lists);
    }

    @GetMapping("/lists/{listId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Obtém uma lista de exercícios pelo ID (com exercícios completos)")
    public ResponseEntity<UserListDto> getById(@PathVariable Long listId) {
        UserListDto dto = listService.getListById(listId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/lists/search")
    public ResponseEntity<Page<UserListDto>> search(
            @RequestParam String q,
            int listPage, int listSize) {

        Page<UserListDto> result = listService.searchLists(q, listPage, listSize);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/lists/{listId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deleta uma lista de exercícios", description = "Remove uma lista do sistema. Apenas administradores podem deletar listas.")
    public ResponseEntity<Void> delete(@PathVariable Long listId) {
        listService.deleteList(listId);
        return ResponseEntity.noContent().build();
    }
}