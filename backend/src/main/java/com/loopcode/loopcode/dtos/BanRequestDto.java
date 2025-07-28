package com.loopcode.loopcode.dtos;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BanRequestDto {
    @Size(max = 500)
    private String banReason;
}
