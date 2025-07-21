package com.loopcode.loopcode.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PistonRunResult(
    String stdout,
    String stderr
) {}
