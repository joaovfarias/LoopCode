package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.challenge.ChallengeResolution;
import com.loopcode.loopcode.domain.challenge.DailyChallenge;
import com.loopcode.loopcode.domain.user.User;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChallengeResolutionRepository
        extends JpaRepository<ChallengeResolution, Long> {

    boolean existsByUserAndDailyChallengeChallengeDate(User user, LocalDate challengeDate);

    Optional<ChallengeResolution> findTopByUserOrderByDailyChallengeChallengeDateDesc(User user);
    
    void deleteAllByDailyChallenge(DailyChallenge dailyChallenge);
}
