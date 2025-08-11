package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.service.ExerciseService;
import com.loopcode.loopcode.service.UserListService;
import com.loopcode.loopcode.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@Tag(name = "Search", description = "Busca unificada de exercícios, usuários e listas")
public class SearchController {

    private final ExerciseService exerciseService;
    private final UserService userService;
    private final UserListService listService;

    public SearchController(ExerciseService exerciseService,
            UserService userService,
            UserListService listService) {
        this.exerciseService = exerciseService;
        this.userService = userService;
        this.listService = listService;
    }

    @GetMapping
    @Operation(summary = "Busca exercícios, usuários e listas pelo termo", description = "Retorna resultados paginados para cada entidade.")
    public ResponseEntity<SearchResultDto> search(
            @RequestParam("q") String q,
            @RequestParam(value = "exPage", defaultValue = "0") int exPage,
            @RequestParam(value = "exSize", defaultValue = "10") int exSize,

            @RequestParam(value = "listPage", defaultValue = "0") int listPage,
            @RequestParam(value = "listSize", defaultValue = "10") int listSize,

            @RequestParam(value = "userPage", defaultValue = "0") int userPage,
            @RequestParam(value = "userSize", defaultValue = "10") int userSize,
            @RequestParam(value = "userRole", required = false) String userRole
                ) {
        Page<ExerciseResponseDto> exResults = exerciseService.searchExercises(q, null, null, "votes", "desc", exPage, exSize);
        Page<UserResponseDto> userResults = userService.searchUsers(q, userRole, userPage, userSize);
        Page<UserListDto> listResults = listService.searchLists(q, listPage, listSize);

        SearchResultDto dto = new SearchResultDto(
                exResults,
                userResults,
                listResults);
        return ResponseEntity.ok(dto);
    }

    public static record SearchResultDto(
            Page<ExerciseResponseDto> exercises,
            Page<UserResponseDto> users,
            Page<UserListDto> lists) {
    }
}
