package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.exercise.Vote;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByExerciseAndUser(Exercise exercise, User user);

    long countByExerciseAndVotoValue(Exercise ex, int votoValue);
    
    List<Vote> findAllByExercise(Exercise exercise);

}
