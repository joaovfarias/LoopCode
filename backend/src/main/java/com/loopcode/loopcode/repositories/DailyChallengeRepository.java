package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.challenge.DailyChallenge;
import com.loopcode.loopcode.domain.exercise.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyChallengeRepository extends JpaRepository<DailyChallenge, Long> {
    Optional<DailyChallenge> findByChallengeDate(LocalDate challengeDate);
    
    Optional<DailyChallenge> findByExercise(Exercise exercise);
}