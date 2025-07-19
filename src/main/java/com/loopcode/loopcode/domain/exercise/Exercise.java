package com.loopcode.loopcode.domain.exercise;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Lob;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String language;
    private String difficulty;
    private String description;

    @Lob
    @JsonIgnore
    private String mainCode;

    @Lob
    @JsonIgnore
    private String testCode;

    private String createdBy;

    private boolean verified = false;

    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}
