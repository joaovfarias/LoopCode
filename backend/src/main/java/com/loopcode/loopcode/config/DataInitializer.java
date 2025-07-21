package com.loopcode.loopcode.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.loopcode.loopcode.domain.language.ProgrammingLanguage;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner initDatabase(ProgrammingLanguageRepository repository)
    {
        return args -> {
            if (repository.count() == 0){
                System.out.println("Populating database with programming languages.");
                repository.saveAll(List.of(
                    new ProgrammingLanguage("Java", "java"),
                    new ProgrammingLanguage("Python", "python"),
                    new ProgrammingLanguage("C", "c")
                    //Adicione mais se quiserem.
            
                ));
                System.out.println("Languages inserted: " + repository.count());
            }
        };
    }
}
