package com.loopcode.loopcode.domain.solved_exercise;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.user.User;

@Entity
@Table(name = "solved_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolvedExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}
