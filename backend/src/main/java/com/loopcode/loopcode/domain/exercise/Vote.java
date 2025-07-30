package com.loopcode.loopcode.domain.exercise;

import com.loopcode.loopcode.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "exercise_id", "user_username" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @ManyToOne
    @JoinColumn(name = "user_username", nullable = false)
    private User user;

    @Column(nullable = false)
    private int votoValue;

    public int getValue() {
        return votoValue;
    }

    public void setValue(int value) {
        this.votoValue = value;
    }

}
