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
    private final ChallengeResolutionRepository resolutionRepository;
    private final UserRepository userRepository;

    public DailyChallengeService(DailyChallengeRepository dailyChallengeRepository,
            ExerciseRepository exerciseRepository,
            ChallengeResolutionRepository resolutionRepository,
            UserRepository userRepository) {
        this.dailyChallengeRepository = dailyChallengeRepository;
        this.exerciseRepository = exerciseRepository;
        this.resolutionRepository = resolutionRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void scheduleDaily() {
        LocalDate today = LocalDate.now();
        if (dailyChallengeRepository.findByChallengeDate(today).isEmpty()) {
            selectNewDailyChallenge(today);
        }
    }

    @Transactional
    public Optional<Exercise> getDailyChallenge() {
        LocalDate today = LocalDate.now();
        return dailyChallengeRepository.findByChallengeDate(today)
                .map(DailyChallenge::getExercise)
                .or(() -> selectNewDailyChallenge(today));
    }

    @Transactional
    public Optional<Exercise> selectNewDailyChallenge(LocalDate date) {
        List<Exercise> verified = exerciseRepository.findByVerifiedTrue();
        if (verified.isEmpty())
            return Optional.empty();
        Exercise chosen = verified.get(new Random().nextInt(verified.size()));
        dailyChallengeRepository.save(new DailyChallenge(chosen, date));
        return Optional.of(chosen);
    }

    @Transactional
    public void resolveDaily(String username) {
        LocalDate today = LocalDate.now();
        DailyChallenge dc = dailyChallengeRepository.findByChallengeDate(today)
                .orElseThrow(() -> new RuntimeException("Desafio diário não definido"));
        if (resolutionRepository.existsByIdUsernameAndIdChallengeDate(username, today)) {
            throw new RuntimeException("Você já resolveu o desafio de hoje");
        }
        User u = userRepository.findByUsername(username)
                .orElseThrow();
        resolutionRepository.save(new ChallengeResolution(
                new ResolutionKey(username, today),
                u, dc,
                LocalDateTime.now()));
    }
}
