package com.loopcode.loopcode.config;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.loopcode.loopcode.domain.exercise.Difficulty;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.exercise.TestCase;
import com.loopcode.loopcode.domain.language.ProgrammingLanguage;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;

import io.jsonwebtoken.io.IOException;

@Configuration
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    DataInitializer(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    @Bean
CommandLineRunner initDatabase(ProgrammingLanguageRepository languagesRepository,
                                UserRepository userRepository,
                                ExerciseRepository exerciseRepository) {
    return args -> {
        if (userRepository.count() == 0) {
            System.out.println("Populating database with users.");

            List<User> defaultUsers = new ArrayList<>();
            defaultUsers.add(new User("admin", "admin@example.com", passwordEncoder.encode("password"), 0, Role.ADMIN));
            defaultUsers.add(new User("user", "user@example.com", passwordEncoder.encode("password"), 0, Role.USER));

            // Read mockUsers.txt from resources
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("mockUsers.txt")) {
                if (inputStream == null) {
                    System.err.println("mockUsers.txt not found in resources!");
                } else {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                    String line;
                    while ((line = reader.readLine()) != null) {
                        String email = line.trim();
                        if (!email.isEmpty()) {
                            String username = email.split("@")[0];
                            defaultUsers.add(new User(username, email, passwordEncoder.encode("password"), 0, Role.USER));
                        }
                    }
                }
            } catch (IOException e) {
                System.err.println("Failed to read mockUsers.txt: " + e.getMessage());
            }

            userRepository.saveAll(defaultUsers);
        }

        if (languagesRepository.count() == 0) {
            System.out.println("Populating database with programming languages.");
            languagesRepository.saveAll(List.of(
                new ProgrammingLanguage("Java", "java"),
                new ProgrammingLanguage("Python", "python"),
                new ProgrammingLanguage("C", "c"),
                new ProgrammingLanguage("C++", "cpp")
            ));
        }

        // Initialize mock exercises
        if (exerciseRepository.count() == 0) {
            System.out.println("Populating database with mock exercises.");
            
            User adminUser = userRepository.findByUsername("admin").orElseThrow();
            ProgrammingLanguage python = languagesRepository.findByName("Python").orElseThrow();
            
            List<Exercise> mockExercises = createMockExercises(adminUser, python);
            exerciseRepository.saveAll(mockExercises);
        }

        System.out.println("Languages inserted: " + languagesRepository.count());
        System.out.println("Users inserted: " + userRepository.count());
        System.out.println("Exercises inserted: " + exerciseRepository.count());
    };
}

    private List<Exercise> createMockExercises(User creator, ProgrammingLanguage python) {
        List<Exercise> exercises = new ArrayList<>();

        Exercise twoSum = new Exercise();
        twoSum.setTitle("Dois Números");
        twoSum.setProgrammingLanguage(python);
        twoSum.setDifficulty(Difficulty.EASY);
        twoSum.setDescription("Dado um array de inteiros nums e um inteiro target, retorne os índices dos dois números de forma que eles somem o valor target. Você pode assumir que cada entrada terá exatamente uma solução e não pode usar o mesmo elemento duas vezes.");
        twoSum.setMainCode("import sys\nimport ast\nnums = ast.literal_eval(sys.argv[1])\ntarget = int(sys.argv[2])\ndef two_sum(nums, target):\n\t{user_code}\nprint(two_sum(nums, target))");
        twoSum.setCreatedBy(creator);
        twoSum.setVerified(true);

        List<TestCase> twoSumTests = new ArrayList<>();
        twoSumTests.add(createTestCase(twoSum, "[2,7,11,15], 9", "[0,1]"));
        twoSumTests.add(createTestCase(twoSum, "[3,2,4], 6", "[1,2]"));
        twoSumTests.add(createTestCase(twoSum, "[3,3], 6", "[0,1]"));
        twoSum.setTestCode(twoSumTests);
        exercises.add(twoSum);

        Exercise palindrome = new Exercise();
        palindrome.setTitle("Palíndromo Válido");
        palindrome.setProgrammingLanguage(python);
        palindrome.setDifficulty(Difficulty.EASY);
        palindrome.setDescription("Uma frase é um palíndromo se, após converter todas as letras maiúsculas em minúsculas e remover todos os caracteres não alfanuméricos, ela for lida da mesma forma de frente para trás e de trás para frente. Dada uma string s, retorne true se for um palíndromo, ou false caso contrário.");
        palindrome.setMainCode("import sys\nimport ast\ns = sys.argv[1]\ndef is_palindrome(s):\n\t{user_code}\nprint(is_palindrome(s))");
        palindrome.setCreatedBy(creator);
        palindrome.setVerified(true);

        List<TestCase> palindromeTests = new ArrayList<>();
        palindromeTests.add(createTestCase(palindrome, "A man a plan a canal Panama", "True"));
        palindromeTests.add(createTestCase(palindrome, "race a car", "False"));
        palindrome.setTestCode(palindromeTests);
        exercises.add(palindrome);

        Exercise longestSubstring = new Exercise();
        longestSubstring.setTitle("Maior Substring Sem Caracteres Repetidos");
        longestSubstring.setProgrammingLanguage(python);
        longestSubstring.setDifficulty(Difficulty.MEDIUM);
        longestSubstring.setDescription("Dada uma string s, encontre o comprimento da maior substring sem caracteres repetidos.");
        longestSubstring.setMainCode("import sys\nimport ast\ns = sys.argv[1]\ndef length_of_longest_substring(s):\n\t{user_code}\nprint(length_of_longest_substring(s))");
        longestSubstring.setCreatedBy(creator);
        longestSubstring.setVerified(true);

        List<TestCase> longestSubstringTests = new ArrayList<>();
        longestSubstringTests.add(createTestCase(longestSubstring, "abcabcbb", "3"));
        longestSubstringTests.add(createTestCase(longestSubstring, "bbbbb", "1"));
        longestSubstringTests.add(createTestCase(longestSubstring, "pwwkew", "3"));
        longestSubstring.setTestCode(longestSubstringTests);
        exercises.add(longestSubstring);

        // Exercício Médio Python: Agrupar Anagramas
        Exercise groupAnagrams = new Exercise();
        groupAnagrams.setTitle("Agrupar Anagramas");
        groupAnagrams.setProgrammingLanguage(python);
        groupAnagrams.setDifficulty(Difficulty.MEDIUM);
        groupAnagrams.setDescription("Dado um array de strings strs, agrupe os anagramas juntos. Você pode retornar a resposta em qualquer ordem.");
        groupAnagrams.setMainCode("import sys\nimport ast\nstrs = ast.literal_eval(sys.argv[1])\ndef group_anagrams(strs):\n\t{user_code}\nprint(group_anagrams(strs))");
        groupAnagrams.setCreatedBy(creator);
        groupAnagrams.setVerified(false);

        List<TestCase> groupAnagramsTests = new ArrayList<>();
        groupAnagramsTests.add(createTestCase(groupAnagrams, "[\'eat\',\'tea\',\'tan\',\'ate\',\'nat\',\'bat\']", "[[\'bat\'],[\'nat\',\'tan\'],[\'ate\',\'eat\',\'tea\']]"));
        groupAnagramsTests.add(createTestCase(groupAnagrams, "[\'a\']", "[[\'a\']]"));
        groupAnagrams.setTestCode(groupAnagramsTests);
        exercises.add(groupAnagrams);

        Exercise fizzBuzz = new Exercise();
        fizzBuzz.setTitle("FizzBuzz");
        fizzBuzz.setProgrammingLanguage(python);
        fizzBuzz.setDifficulty(Difficulty.EASY);
        fizzBuzz.setDescription("Dado um inteiro n, retorne um array de strings answer (indexado a partir de 1) onde: answer[i] == \"FizzBuzz\" se i for divisível por 3 e 5, answer[i] == \"Fizz\" se i for divisível por 3, answer[i] == \"Buzz\" se i for divisível por 5, answer[i] == i (como string) se nenhuma das condições anteriores for verdadeira.");
        fizzBuzz.setMainCode("import sys\nimport ast\nn = int(sys.argv[1])\ndef fizz_buzz(n):\n\t{user_code}\nprint(fizz_buzz(n))");
        fizzBuzz.setCreatedBy(creator);
        fizzBuzz.setVerified(true);

        List<TestCase> fizzBuzzTests = new ArrayList<>();
        fizzBuzzTests.add(createTestCase(fizzBuzz, "3", "[\'1\',\'2\',\'Fizz\']"));
        fizzBuzzTests.add(createTestCase(fizzBuzz, "5", "[\'1\',\'2\',\'Fizz\',\'4\',\'Buzz\']"));
        fizzBuzz.setTestCode(fizzBuzzTests);
        exercises.add(fizzBuzz);

        Exercise reverseString = new Exercise();
        reverseString.setTitle("Inverter String");
        reverseString.setProgrammingLanguage(python);
        reverseString.setDifficulty(Difficulty.EASY);
        reverseString.setDescription("Escreva uma função que inverta uma string.");
        reverseString.setMainCode("import sys\nimport ast\ns = (sys.argv[1])\ndef reverse_string(s):\n\t{user_code}\nprint(reverse_string(s))");
        reverseString.setCreatedBy(creator);
        reverseString.setVerified(false);

        List<TestCase> reverseStringTests = new ArrayList<>();
        reverseStringTests.add(createTestCase(reverseString, "hello", "olleh"));
        reverseStringTests.add(createTestCase(reverseString, "Hannah", "hannaH"));
        reverseStringTests.add(createTestCase(reverseString, "kaiak", "kaiak"));
        reverseStringTests.add(createTestCase(reverseString, "bottle", "elttob"));
        reverseString.setTestCode(reverseStringTests);
        exercises.add(reverseString);
        
        return exercises;
    }
    
    private TestCase createTestCase(Exercise exercise, String input, String expectedOutput) {
        TestCase testCase = new TestCase();
        testCase.setExercise(exercise);
        testCase.setInput(input);
        testCase.setExpectedOutput(expectedOutput);
        return testCase;
    }


}
