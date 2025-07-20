package com.loopcode.loopcode.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.loopcode.loopcode.domain.exercise.Exercise;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByVerifiedTrue();

    Page<Exercise> findByLanguage(String language, Pageable pageable);

}