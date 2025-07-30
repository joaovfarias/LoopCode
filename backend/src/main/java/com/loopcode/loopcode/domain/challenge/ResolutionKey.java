package com.loopcode.loopcode.domain.challenge;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor 
public class ResolutionKey implements Serializable {
    private String username;
    private LocalDate challengeDate;
}
