package com.loopcode.loopcode.service;


import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.loopcode.loopcode.dtos.ExecutionResultDto;
import com.loopcode.loopcode.dtos.PistonExecuteRequest;
import com.loopcode.loopcode.dtos.PistonExecuteResponse;
import com.loopcode.loopcode.dtos.PistonFile;

@Service
@Profile("piston")
public class PistonApiExecutionService implements CodeExecutionService{

    private final RestTemplate restTemplate = new RestTemplate();
    private final String executeURL = "https://emkc.org/api/v2/piston/execute";
    private final PistonRuntimesService runtimesService;

    public PistonApiExecutionService(PistonRuntimesService runtimesService)
    {
        this.runtimesService = runtimesService;
    }

    @Override
    public ExecutionResultDto execute(String code, String input, String languageIdentifier)
    {
        String version = runtimesService.getVersionForLanguage(languageIdentifier).orElse("*");

        PistonFile file = new PistonFile("main." + languageIdentifier, code);
        PistonExecuteRequest requestPayload = new PistonExecuteRequest(languageIdentifier, version, List.of(file), input);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PistonExecuteRequest> httpEntity = new HttpEntity<>(requestPayload, headers);

        try{
            ResponseEntity<PistonExecuteResponse> responseEntity = restTemplate.postForEntity(executeURL,httpEntity,PistonExecuteResponse.class);

            PistonExecuteResponse pistonResponse = responseEntity.getBody();

            if (pistonResponse != null && pistonResponse.run() != null)
            {
                return new ExecutionResultDto(
                    pistonResponse.run().stdout(),
                    pistonResponse.run().stderr()
                );
            } else {

                return new ExecutionResultDto("", "Invalid response from Piston API.");
            }
        } catch (RestClientException e) {

            System.err.println("Error calling Piston API: " + e.getMessage());
            
            return new ExecutionResultDto("", "Failed to get response from Piston API");
        }



    }

    private String escapeJson(String raw) {
        return raw.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r");
    }
}
