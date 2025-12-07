package com.loopcode.loopcode.tools;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHasher {

    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Usage: java PasswordHasher <password>");
            System.exit(1);
        }
        String plain = args[0];
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashed = encoder.encode(plain);
        System.out.println(hashed);
    }
}
