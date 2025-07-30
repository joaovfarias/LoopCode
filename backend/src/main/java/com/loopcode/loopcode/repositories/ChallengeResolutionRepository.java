package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.challenge.ChallengeResolution;
import com.loopcode.loopcode.domain.challenge.ResolutionKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeResolutionRepository
        extends JpaRepository<ChallengeResolution, ResolutionKey> {
    boolean existsByIdUsernameAndIdChallengeDate(String username, java.time.LocalDate date);
} // talvez dê pra meter no dailychallengerepo
