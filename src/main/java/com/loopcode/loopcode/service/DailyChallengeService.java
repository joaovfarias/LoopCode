package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.challenge.DailyChallenge;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.repositories.DailyChallengeRepository;
import com.loopcode.loopcode.repositories.ExerciseRepository;

//import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class DailyChallengeService {

    private final DailyChallengeRepository dailyChallengeRepository;
    private final ExerciseRepository exerciseRepository;

    public DailyChallengeService(DailyChallengeRepository dailyChallengeRepository,
            ExerciseRepository exerciseRepository) {
        this.dailyChallengeRepository = dailyChallengeRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional
    public Optional<Exercise> getDailyChallenge() {
        LocalDate today = LocalDate.now();
        Optional<DailyChallenge> existingChallenge = dailyChallengeRepository.findByChallengeDate(today);

        if (existingChallenge.isPresent()) {
            return Optional.of(existingChallenge.get().getExercise());
        } else {
            return selectNewDailyChallenge(today);
        }
    }

    // botar a lógica aqui
    @Transactional
    public Optional<Exercise> selectNewDailyChallenge(LocalDate date) {

        List<Exercise> verifiedExercises = exerciseRepository.findByVerifiedTrue();

        if (verifiedExercises.isEmpty()) {
            System.out.println("Nenhum exercício verificado disponível para o desafio diário.");
            return Optional.empty();
        }
        Random random = new Random();
        Exercise selectedExercise = verifiedExercises.get(random.nextInt(verifiedExercises.size()));

        // Salva o novo desafio diário
        DailyChallenge newChallenge = new DailyChallenge(selectedExercise, date);
        dailyChallengeRepository.save(newChallenge);

        System.out.println("Novo desafio diário selecionado para " + date + ": " +
                selectedExercise.getTitle());

        return Optional.of(selectedExercise);

        // return null;
    }
}