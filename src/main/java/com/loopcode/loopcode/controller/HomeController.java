package com.loopcode.loopcode.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loopcode.loopcode.dtos.HomeResponseDto;
import com.loopcode.loopcode.service.HomeService;

@RestController
@RequestMapping("/home")
public class HomeController {
    
    private final HomeService homeService;

    public HomeController(HomeService homeService){
        this.homeService = homeService;
    }

    @GetMapping("/data")
    public ResponseEntity<HomeResponseDto> getHomeData() {

        HomeResponseDto data = homeService.getHomeData();
        return ResponseEntity.ok(data);
    }
}
