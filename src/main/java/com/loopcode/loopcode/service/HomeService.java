package com.loopcode.loopcode.service;

import org.springframework.stereotype.Service;

import com.loopcode.loopcode.dtos.HomeResponseDto;
import com.loopcode.loopcode.repositories.DailyChallengeRepository;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.UserRepository;

@Service
public class HomeService {
    
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final DailyChallengeRepository dailyChallengeRepository;

    public HomeService(UserRepository userRepository, ExerciseRepository exerciseRepository, DailyChallengeRepository dailyChallengeRepository){
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.dailyChallengeRepository = dailyChallengeRepository;
    }

    public HomeResponseDto getHomeData() {
        HomeResponseDto homeData = new HomeResponseDto();

        return homeData;
    }
}
