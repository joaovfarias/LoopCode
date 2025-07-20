package com.loopcode.loopcode.service;

import java.util.List;

public interface CodeExecutionService {
    String execute(String code, List<String> inputs, String language);
}

