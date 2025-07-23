package com.loopcode.loopcode.config;

/*import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.loopcode.loopcode.domain.language.ProgrammingLanguage;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;

@Configuration
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Bean
    CommandLineRunner initDatabase(ProgrammingLanguageRepository languagesRepository, 
                                   UserRepository userRepository)
    {
        return args -> {
            if (userRepository.count() == 0) {
                System.out.println("Populating database with users.");
                userRepository.saveAll(List.of(
                    new User("admin", "admin@example.com", passwordEncoder.encode("password"), 0, Role.ADMIN),
                    new User("user", "user@example.com", passwordEncoder.encode("password"), 0, Role.USER)
                ));
            }
            if (languagesRepository.count() == 0){
                System.out.println("Populating database with programming languages.");
                languagesRepository.saveAll(List.of(
                    new ProgrammingLanguage("Java", "java"),
                    new ProgrammingLanguage("Python", "python"),
                    new ProgrammingLanguage("C", "c"),
                    new ProgrammingLanguage("C++", "cpp")
                ));
            }
            System.out.println("Languages inserted: " + languagesRepository.count());
            System.out.println("Users inserted: " + userRepository.count());
        };
    }

}
*/