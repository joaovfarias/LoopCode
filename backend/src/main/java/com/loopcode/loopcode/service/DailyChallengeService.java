package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.challenge.ChallengeResolution;
import com.loopcode.loopcode.domain.challenge.DailyChallenge;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.DailyChallengeRepository;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ChallengeResolutionRepository;
import com.loopcode.loopcode.repositories.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.channels.Pipe.SourceChannel;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
        System.out.println("Scheduling daily challenge for date: " + today);
        if (dailyChallengeRepository.findByChallengeDate(today).isEmpty()) {
            selectNewDailyChallenge(today);
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyChallenges() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<User> allUsers = userRepository.findAll();
        System.out.println("Resetting daily challenges for users...");

        for (User user : allUsers) {
            boolean solvedYesterday = resolutionRepository.existsByUserAndDailyChallengeChallengeDate(user, yesterday);
            if (!solvedYesterday) {
                System.out.println("Resetting daily streak for user: " + user.getUsername());
                user.setDailyStreak(0);
                userRepository.save(user);
            }
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

        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (resolutionRepository.existsByUserAndDailyChallengeChallengeDate(u, today)) {
            throw new RuntimeException("Você já resolveu o desafio de hoje");
        }

        Optional<ChallengeResolution> lastResOpt = resolutionRepository
                .findTopByUserOrderByDailyChallengeChallengeDateDesc(u);

        int newStreak = 1;
        if (lastResOpt.isPresent()) {
            LocalDate lastDate = lastResOpt.get().getDailyChallenge().getChallengeDate();
            if (lastDate.equals(today.minusDays(1))) {
                newStreak = u.getDailyStreak() + 1;
            }
        }

        u.setDailyStreak(newStreak);
        userRepository.save(u);

        ChallengeResolution resolution = new ChallengeResolution(u, dc, LocalDateTime.now());
        resolutionRepository.save(resolution);
    }

}
