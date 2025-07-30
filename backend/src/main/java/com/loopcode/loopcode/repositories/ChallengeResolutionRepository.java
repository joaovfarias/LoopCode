package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.challenge.ChallengeResolution;
import com.loopcode.loopcode.domain.challenge.ResolutionKey;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeResolutionRepository
        extends JpaRepository<ChallengeResolution, ResolutionKey> {

    boolean existsByIdUsernameAndIdChallengeDate(String username, LocalDate challengeDate);
}
