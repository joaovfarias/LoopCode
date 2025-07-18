package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.dtos.ExerciseRequestDto;
import com.loopcode.loopcode.dtos.SolveResponseDto;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.service.CodeExecutionService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

//import java.time.LocalDateTime;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final CodeExecutionService execService;

    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository,
            CodeExecutionService execService) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.execService = execService;
    }

    @Transactional
    public Exercise createExercise(ExerciseRequestDto dto, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Exercise exercise = new Exercise();
        exercise.setTitle(dto.title());
        exercise.setLanguage(dto.language());
        exercise.setDifficulty(dto.difficulty());
        exercise.setDescription(dto.description());
        exercise.setMainCode(dto.mainCode());
        exercise.setTestCode(dto.testCode());
        exercise.setCreatedBy(creator.getUsername());

        // exercise.setUpvotes(0);
        // exercise.setDownvotes(0);
        // exercise.setVerified(false);
        // exercise.setCreatedAt(LocalDateTime.now());

        return exerciseRepository.save(exercise);
    }

    public Page<Exercise> getExercises(
            String language,
            String difficulty,
            String type, // 'exercise' ou 'list' (se for um endpoint unificado para ambos)
            String sortBy, // 'createdAt', 'upvotes', etc.
            String order, // 'asc' ou 'desc'
            int page,
            int size) {

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy != null && !sortBy.isEmpty() ? sortBy : "createdAt"); // Default sort
                                                                                                        // by createdAt

        PageRequest pageable = PageRequest.of(page, size, sort);

        if (language != null && !language.isEmpty() && !language.equalsIgnoreCase("all")) {
            return exerciseRepository.findByLanguage(language, pageable);
        }

        return exerciseRepository.findAll(pageable);

    }

    @Transactional
    public SolveResponseDto solve(UUID exerciseId,
            String userCode,
            List<String> inputs,
            String language,
            String username) {

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found: " + exerciseId));

        String expectedOutput = execService.execute(exercise.getTestCode(), inputs, language);

        String actualOutput = execService.execute(userCode, inputs, language);

        boolean passed = expectedOutput.trim().equals(actualOutput.trim());
        String feedback = passed
                ? "Resposta correta!"
                : "Resposta incorreta. Saída esperada: `" + expectedOutput + "`";

        return new SolveResponseDto(
                actualOutput,
                passed,
                feedback,
                expectedOutput);
    }
}
