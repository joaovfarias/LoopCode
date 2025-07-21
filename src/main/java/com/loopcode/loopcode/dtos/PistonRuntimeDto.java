package com.loopcode.loopcode.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PistonRuntimeDto(
    String language,
    String version,
    List<String> aliases
) {}
