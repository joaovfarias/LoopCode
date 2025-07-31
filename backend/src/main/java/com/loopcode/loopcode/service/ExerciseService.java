package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.exercise.Difficulty;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.exercise.TestCase;
import com.loopcode.loopcode.domain.exercise.Vote;
import com.loopcode.loopcode.domain.language.ProgrammingLanguage;
import com.loopcode.loopcode.dtos.ExecutionResultDto;
import com.loopcode.loopcode.dtos.ExerciseRequestDto;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.LanguageDto;
import com.loopcode.loopcode.dtos.SimpleUserDto;
import com.loopcode.loopcode.dtos.SolveRequestDto;
import com.loopcode.loopcode.dtos.SolveResponseDto;
import com.loopcode.loopcode.exceptions.ResourceNotFoundException;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.repositories.VoteRepository;
import com.loopcode.loopcode.service.specifications.ExerciseSpecifications;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final CodeExecutionService codeExecutionService;
    private final VoteRepository voteRepository;

    // Aparentemente certo
    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository,
            ProgrammingLanguageRepository programmingLanguageRepository, CodeExecutionService codeExecutionService,
            VoteRepository voteRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.programmingLanguageRepository = programmingLanguageRepository;
        this.codeExecutionService = codeExecutionService;
        this.voteRepository = voteRepository;
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

        try {
            exercise.setDifficulty(Difficulty.valueOf(dto.difficulty().toUpperCase()));
        } catch (IllegalArgumentException e) {
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

        if (difficulty != null && !difficulty.isEmpty()) {
            spec = spec.and(ExerciseSpecifications.hasDifficulty(difficulty));
        }

        Page<Exercise> exercisePage = exerciseRepository.findAll(spec, pageable);

        return exercisePage.map(this::convertToDto);
    }

    private Exercise getExerciseByIdUtil(UUID id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado com o ID: " + id));

        return exercise;
    }

    @Transactional(readOnly = true)
    public ExerciseResponseDto getExerciseById(UUID id) {
        return convertToDto(getExerciseByIdUtil(id));
    }

    @Transactional
    public SolveResponseDto solveExercise(UUID exerciseId, SolveRequestDto solveDto, String username) {
        Exercise exercise = getExerciseByIdUtil(exerciseId);

        String apiLanguageIdentifier = exercise.getProgrammingLanguage().getApiIdentifier();

        String fullCode = exercise.getMainCode();
        fullCode = fullCode.replace("{user_code}", solveDto.code());

        for (TestCase testCase : exercise.getTestCode()) {
            ExecutionResultDto result = codeExecutionService.execute(
                    fullCode,
                    testCase.getInput(),
                    apiLanguageIdentifier);

            if (result.error() != null && !result.error().isEmpty()) {
                return new SolveResponseDto(result.error(), false, "Ocorreu um erro de compilacão ou execucão:", "");
            }

            String normalizedOutput = result.output().replaceAll("\\s+", "");
            String normalizedExpectedOutput = testCase.getExpectedOutput().replaceAll("\\s+", "");

            if (!normalizedOutput.equals(normalizedExpectedOutput)) {
                String feedbackMessage = "Falhou no caso de teste com output: \"" + testCase.getExpectedOutput()
                        + "\".";
                return new SolveResponseDto(result.output(), false, feedbackMessage, testCase.getExpectedOutput());
            }

        }
        // Aqui marcar na tabela dos resolvido qnd tiver.
        return new SolveResponseDto("", true, "Voce passou em todos os testes!", "");

    }

    private ExerciseResponseDto convertToDto(Exercise exercise) {
        LanguageDto langDto = new LanguageDto(
                exercise.getProgrammingLanguage().getId(),
                exercise.getProgrammingLanguage().getName());

        SimpleUserDto userDto = new SimpleUserDto(
                exercise.getCreatedBy().getUsername());

        int ups = (int) voteRepository.countByExerciseAndVotoValue(exercise, +1);
        int downs = (int) voteRepository.countByExerciseAndVotoValue(exercise, -1);
        int voteCount = ups - downs;
        var auth = SecurityContextHolder.getContext().getAuthentication();
        int userVote = 0;
        if (auth != null && auth instanceof UsernamePasswordAuthenticationToken) {
            User u = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            userVote = voteRepository.findByExerciseAndUser(exercise, u)
                    .map(Vote::getValue).orElse(0);
        }
        return new ExerciseResponseDto(
                exercise.getId(),
                exercise.getTitle(),
                langDto,
                exercise.getDifficulty().toString(),
                exercise.getDescription(),
                userDto,
                exercise.isVerified(),
                exercise.getCreatedAt(),
                exercise.getMainCode(),
                exercise.getTestCode(), voteCount, ups, downs,
                userVote);

    }

    @Transactional
    public void toggleVote(UUID exerciseId, String username, boolean up) {
        Exercise ex = getExerciseByIdUtil(exerciseId);
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Optional<Vote> existingVoteOpt = voteRepository.findByExerciseAndUser(ex, u);
        int newValue = up ? +1 : -1;

        if (existingVoteOpt.isPresent()) {
            Vote existingVote = existingVoteOpt.get();
            if (existingVote.getValue() == newValue) {
                // Se o voto atual for igual ao que usuário clicou, remove o voto (toggle off)
                voteRepository.delete(existingVote);
            } else {
                // Se for voto diferente, atualiza para o novo
                existingVote.setValue(newValue);
                voteRepository.save(existingVote);
            }
        } else {
            // Se não existir voto, cria um novo com o valor informado
            Vote v = new Vote();
            v.setExercise(ex);
            v.setUser(u);
            v.setValue(newValue);
            voteRepository.save(v);
        }
    }

}
