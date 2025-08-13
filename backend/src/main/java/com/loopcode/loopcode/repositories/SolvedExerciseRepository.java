package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.solved_exercise.SolvedExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.UUID;

public interface SolvedExerciseRepository extends JpaRepository<SolvedExercise, Long> {
    boolean existsByUserUsernameAndExerciseId(String username, UUID exerciseId);

    <Optional>SolvedExercise findByUserUsernameAndExerciseId(String username, UUID exerciseId);

    int countByUserUsername(String username);
}