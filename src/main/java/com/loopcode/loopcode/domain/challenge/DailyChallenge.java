package com.loopcode.loopcode.domain.challenge;

import com.loopcode.loopcode.domain.exercise.Exercise; // Importe sua entidade Exercise
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

//generico pra fazer, não lembro de qual se decidiu usar
import java.time.LocalDate;

@Entity
@Table(name = "daily_challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "exercise_id", unique = true, nullable = false)
    private Exercise exercise;

    @Column(nullable = false, unique = true)
    private LocalDate challengeDate;

    public DailyChallenge(Exercise exercise, LocalDate challengeDate) {
        this.exercise = exercise;
        this.challengeDate = challengeDate;
    }
}
