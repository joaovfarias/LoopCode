package com.loopcode.loopcode.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.user.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID>, JpaSpecificationExecutor<Exercise> {
    List<Exercise> findByVerifiedTrue();

    Page<Exercise> findByCreatedBy(User user, Pageable pageable);

    Optional<Exercise> findById(UUID id);
}
