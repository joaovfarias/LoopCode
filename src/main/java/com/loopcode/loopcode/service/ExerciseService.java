package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.exercise.Difficulty;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.exercise.TestCase;
import com.loopcode.loopcode.domain.language.ProgrammingLanguage;
import com.loopcode.loopcode.dtos.ExerciseRequestDto;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.LanguageDto;
import com.loopcode.loopcode.dtos.SimpleUserDto;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.service.specifications.ExerciseSpecifications;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification; 
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


//import java.time.LocalDateTime;

@Service
public class ExerciseService {

    private final ProgrammingLanguageRepository programmingLanguageRepository;

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    //Aparentemente certo
    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository, ProgrammingLanguageRepository programmingLanguageRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.programmingLanguageRepository = programmingLanguageRepository;
    }

    @Transactional
    public Exercise createExercise(ExerciseRequestDto dto, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        ProgrammingLanguage language = programmingLanguageRepository.findById(dto.languageId())
                .orElseThrow(() -> new RuntimeException("Programming language not found with ID: " + dto.languageId()));
          
        Exercise exercise = new Exercise();
        exercise.setTitle(dto.title());
        exercise.setDescription(dto.description());
        exercise.setMainCode(dto.mainCode());

        // exercise.setUpvotes(0);
        // exercise.setDownvotes(0);
        // exercise.setVerified(false);
        // exercise.setCreatedAt(LocalDateTime.now());

        try {
            exercise.setDifficulty(Difficulty.valueOf(dto.difficulty().toUpperCase()));
        }catch (IllegalArgumentException e) {
            throw new RuntimeException("Not a valid difficulty: " + dto.difficulty());
        }

        exercise.setCreatedBy(creator);
        exercise.setProgrammingLanguage(language);

        dto.testCases().forEach(testCaseDto -> {
            TestCase testCase = new TestCase();
            testCase.setInput(testCaseDto.input());
            testCase.setExpectedOutput(testCaseDto.expectedOutput());
            testCase.setExercise(exercise);
            exercise.getTestCode().add(testCase);
        });
        return exerciseRepository.save(exercise);
    }

    @Transactional(readOnly = true)
    public Page<ExerciseResponseDto> getExercises(
            String language,
            String difficulty,         
            //------------------TEM QUE IMPLEMENTAR DIFFICULTY E TYPE DEPOIS!!------------------
            //String type, // 'exercise' ou 'list' (se for um endpoint unificado para ambos)
            String sortBy, // 'createdAt', 'upvotes', etc.
            String order, // 'asc' ou 'desc'
            int page,
            int size) {

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy != null && !sortBy.isEmpty() ? sortBy : "createdAt"); // Default sort
                                                                                                        // by createdAt

        PageRequest pageable = PageRequest.of(page, size, sort);

        Specification<Exercise> spec = (root, query, builder) -> builder.conjunction();

        if (language != null && !language.isEmpty() && !language.equalsIgnoreCase("all")) {
            spec = spec.and(ExerciseSpecifications.hasLanguage(language));
        }

        if (difficulty != null && !difficulty.isEmpty()){
           spec = spec.and(ExerciseSpecifications.hasDifficulty(difficulty)); 
        }

        Page<Exercise> exercisePage = exerciseRepository.findAll(spec, pageable);

        return exercisePage.map(this::convertToDto);
    }

    /*
    @Transactional
    public SolveResponseDto solve(UUID exerciseId,
            String userCode,
            List<String> inputs,
            String language,
            String username) {

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found: " + exerciseId));

        String expectedOutput = execService.execute(exercise.getTestCode(), inputs, language);

        String actualOutput = execService.execute(userCode, inputs, language);

        boolean passed = expectedOutput.trim().equals(actualOutput.trim());
        String feedback = passed
                ? "Resposta correta!"
                : "Resposta incorreta. Saída esperada: `" + expectedOutput + "`";

        return new SolveResponseDto(
                actualOutput,
                passed,
                feedback,
                expectedOutput);
    }*/

    private ExerciseResponseDto convertToDto(Exercise exercise)
    {
        LanguageDto langDto = new LanguageDto(
            exercise.getProgrammingLanguage().getId(),
            exercise.getProgrammingLanguage().getName()
        );

        SimpleUserDto userDto = new SimpleUserDto(
            exercise.getCreatedBy().getUsername()
        );

        return new ExerciseResponseDto(
            exercise.getId(),
            exercise.getTitle(),
            langDto,
            exercise.getDifficulty().toString(),
            exercise.getDescription(),
            userDto,
            exercise.isVerified(),
            exercise.getCreatedAt()
        );

    }
}


