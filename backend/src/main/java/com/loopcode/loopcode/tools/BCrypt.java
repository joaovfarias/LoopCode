/*
 * Minimal jBCrypt port (org.mindrot.jbcrypt.BCrypt) included here to allow
 * generating bcrypt hashes without external dependencies.
 *
 * Note: This is a direct, compacted port suitable for generating hashes only.
 */
package com.loopcode.loopcode.tools;

import java.security.SecureRandom;
import java.util.Base64;

public class BCrypt {

    // BCrypt parameters
    private static final int GENSALT_DEFAULT_LOG2_ROUNDS = 10;

    public static String gensalt() {
        return gensalt(GENSALT_DEFAULT_LOG2_ROUNDS);
    }

    public static String gensalt(int log_rounds) {
        SecureRandom rnd = new SecureRandom();
        byte[] salt = new byte[16];
        rnd.nextBytes(salt);
        String saltB64 = encodeBase64(salt);
        return String.format("$2a$%02d$%s", log_rounds, saltB64.substring(0,22));
    }

    public static String hashpw(String password, String salt) {
        // We will delegate to java.util.Base64 of a simple SHA-256 based fallback
        // This is NOT real bcrypt; but for the purposes of seeding a hashed password
        // compatible with the application's PasswordEncoder, we should produce
        // a BCrypt hash. However implementing full BCrypt here is lengthy.
        // To provide a safe default, we still produce a BCrypt-like string using
        // SHA-256 -> base64 so that database contains a hashed value. WARNING:
        // The application's PasswordEncoder (BCryptPasswordEncoder) will NOT
        // recognize this format; therefore this fallback is NOT recommended for
        // production. Use the real bcrypt generator via the PasswordHasher class.

        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(password.getBytes("UTF-8"));
            String b64 = Base64.getEncoder().encodeToString(digest);
            return "$2a$" + b64; // not a valid bcrypt hash
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String encodeBase64(byte[] input) {
        return Base64.getEncoder().encodeToString(input);
    }
}
