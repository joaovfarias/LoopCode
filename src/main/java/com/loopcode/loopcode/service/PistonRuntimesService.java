package com.loopcode.loopcode.service;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.loopcode.loopcode.dtos.PistonRuntimeDto;

import jakarta.annotation.PostConstruct;

@Service
public class PistonRuntimesService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String runtimesURL = "https://emkc.org/api/v2/piston/runtimes";
    private final Map<String, String> runtimeMap = new ConcurrentHashMap<>();

    @PostConstruct
    public void fetchAndCacheRuntimes()
    {
        System.out.println("Searching and caching runtimes from Piston API");

        PistonRuntimeDto[] runtimes = restTemplate.getForObject(runtimesURL, PistonRuntimeDto[].class);

        if (runtimes != null) {
            Arrays.stream(runtimes).forEach(runtime -> {
                runtimeMap.put(runtime.language(), runtime.version());

                runtime.aliases().forEach(alias -> runtimeMap.put(alias, runtime.version()));
            } );
        }
    }

    public Optional<String> getVersionForLanguage(String language){
        return Optional.ofNullable(runtimeMap.get(language));
    }
}

