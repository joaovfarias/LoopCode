package com.loopcode.loopcode.service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MockCodeExecutionService implements CodeExecutionService {
    @Override
    public String execute(String code, List<String> inputs, String language) {
        return "MOCK_OUTPUT";
    }
}
