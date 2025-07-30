package com.loopcode.loopcode.domain.user;

import com.loopcode.loopcode.domain.exercise.Exercise;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(name = "user_list_exercises", joinColumns = @JoinColumn(name = "list_id"), inverseJoinColumns = @JoinColumn(name = "exercise_id"))
    @Builder.Default
    private Set<Exercise> exercises = new HashSet<>();

}
