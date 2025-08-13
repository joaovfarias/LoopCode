package com.loopcode.loopcode.service;

import jakarta.transaction.Transactional;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.solved_exercise.SolvedExercise;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.exceptions.ResourceNotFoundException;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.repositories.SolvedExerciseRepository;

@Service
public class SolvedExerciseService {
    private final SolvedExerciseRepository solvedExerciseRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    public SolvedExerciseService(SolvedExerciseRepository solvedExerciseRepository, UserRepository userRepository, ExerciseRepository exerciseRepository) {
        this.solvedExerciseRepository = solvedExerciseRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional
    public SolvedExercise markAsSolved(String username, UUID exerciseId) {
        // Verifica já existe um registro de solução para o usuário e exercício
        if (solvedExerciseRepository.existsByUserUsernameAndExerciseId(username, exerciseId)) {
            SolvedExercise solvedExercise = solvedExerciseRepository.findByUserUsernameAndExerciseId(username, exerciseId);
            if (solvedExercise == null) {
                throw new ResourceNotFoundException("Solução não encontrada para o usuário: " + username + " e exercício ID: " + exerciseId);
            }
            return solvedExercise;
        }

        SolvedExercise solvedExercise = new SolvedExercise();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com username: " + username));
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado com ID: " + exerciseId));

        solvedExercise.setUser(user);
        solvedExercise.setExercise(exercise);
        solvedExerciseRepository.save(solvedExercise);

        return solvedExercise;
    }

}