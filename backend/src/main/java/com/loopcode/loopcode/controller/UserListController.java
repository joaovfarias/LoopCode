package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.CreateUserListDto;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.service.UserListService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    public ResponseEntity<UserListDto> create(
            @PathVariable String username,
            @RequestBody @Valid CreateUserListDto dto) {
        var created = listService.createList(username, dto);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    @PreAuthorize("#username == authentication.name")
    public ResponseEntity<java.util.List<UserListDto>> all(
            @PathVariable String username) {
        return ResponseEntity.ok(listService.getListsByUsername(username));
    }

    @GetMapping("/{listId}")
    @PreAuthorize("#username == authentication.name")
    public ResponseEntity<UserListDto> getById(
            @PathVariable String username,
            @PathVariable Long listId) {
        return ResponseEntity.ok(listService.getListById(username, listId));
    }
}
