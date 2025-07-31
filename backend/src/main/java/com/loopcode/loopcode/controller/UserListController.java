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
@RequestMapping("/users/{username}/lists")
@Tag(name = "UserLists", description = "Operações com listas de exercícios do usuário")
public class UserListController {

    private final UserListService listService;

    public UserListController(UserListService listService) {
        this.listService = listService;
    }

    @PostMapping
    @PreAuthorize("#username == authentication.name")
    @Operation(summary = "Cria uma nova lista de exercícios")
    public ResponseEntity<UserListDto> create(
            @PathVariable String username,
            @RequestBody @Valid CreateUserListDto dto) {
        var created = listService.createList(username, dto);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    @PreAuthorize("#username == authentication.name")
    @Operation(summary = "Obtém todas as listas de exercícios do usuário (paginado)")
    public ResponseEntity<Page<UserListDto>> all(
            @PathVariable String username,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<UserListDto> lists = listService.getListsByUsername(username, pageable);
        return ResponseEntity.ok(lists);
    }


    @GetMapping("/{listId}")
    @PreAuthorize("#username == authentication.name")
    @Operation(summary = "Obtém uma lista de exercícios pelo ID")
    public ResponseEntity<UserListDto> getById(
            @PathVariable String username,
            @PathVariable Long listId) {
        return ResponseEntity.ok(listService.getListById(username, listId));
    }
}
