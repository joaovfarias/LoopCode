package com.loopcode.loopcode.tools;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@Profile("generate-hash")
public class HashPasswordRunner implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;

    public HashPasswordRunner(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String plain = System.getenv("HASH_PLAIN");
        for (String a : args) {
            if (a.startsWith("--hash.plain=")) {
                plain = a.substring("--hash.plain=".length());
            }
        }

        if (plain == null || plain.isBlank()) {
            System.err.println("Provide a password via env HASH_PLAIN or --hash.plain=<password>");
            System.exit(1);
        }

        String hashed = passwordEncoder.encode(plain);
        System.out.println(hashed);
        // exit so the app doesn't keep running
        System.exit(0);
    }
}
