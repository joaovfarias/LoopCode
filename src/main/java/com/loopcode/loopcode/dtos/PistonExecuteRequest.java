package com.loopcode.loopcode.dtos;

import java.util.List;

public record PistonExecuteRequest(
    String language,
    String version,
    List<PistonFile> files,
    String stdin
) {}
