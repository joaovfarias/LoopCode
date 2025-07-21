package com.loopcode.loopcode.service;

import com.loopcode.loopcode.dtos.ExecutionResultDto;

public interface CodeExecutionService {

    public ExecutionResultDto execute(String code, String input, String language);
}
