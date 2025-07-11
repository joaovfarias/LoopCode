package com.loopcode.loopcode.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
public class homeController {

    private final UserService userService;

    public homeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String homePath() {
        return "homePath";
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequestDto request) {
        userService.register(request);
    }

}
