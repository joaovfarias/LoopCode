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
import com.loopcode.loopcode.dtos.TestCaseResultDto;
import com.loopcode.loopcode.exceptions.ResourceNotFoundException;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;
import com.loopcode.loopcode.repositories.DailyChallengeRepository;
import com.loopcode.loopcode.repositories.ChallengeResolutionRepository;
import com.loopcode.loopcode.repositories.UserListRepository;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.domain.user.UserList;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.repositories.VoteRepository;
import com.loopcode.loopcode.service.specifications.ExerciseSpecifications;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
    private final DailyChallengeRepository dailyChallengeRepository;
    private final ChallengeResolutionRepository challengeResolutionRepository;
    private final UserListRepository userListRepository;

    // Aparentemente certo
    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository,
            ProgrammingLanguageRepository programmingLanguageRepository, CodeExecutionService codeExecutionService,
            VoteRepository voteRepository, DailyChallengeRepository dailyChallengeRepository,
            ChallengeResolutionRepository challengeResolutionRepository, UserListRepository userListRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.programmingLanguageRepository = programmingLanguageRepository;
        this.codeExecutionService = codeExecutionService;
        this.voteRepository = voteRepository;
        this.dailyChallengeRepository = dailyChallengeRepository;
        this.challengeResolutionRepository = challengeResolutionRepository;
        this.userListRepository = userListRepository;
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
            String sortBy, // 'createdAt', 'votescount', etc.
            String order, // 'asc' ou 'desc'
            int page,
            int size) {

        Specification<Exercise> spec = Specification.where(null);
        if (language != null && !language.isBlank() && !"all".equalsIgnoreCase(language)) {
            spec = spec.and(ExerciseSpecifications.hasLanguage(language));
        }
        if (difficulty != null && !difficulty.isBlank()) {
            spec = spec.and(ExerciseSpecifications.hasDifficulty(difficulty));
        }
        
        if (!"votes".equalsIgnoreCase(sortBy)) {
            Sort.Direction dir = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Sort sort = Sort.by(dir, sortBy != null ? sortBy : "createdAt");
            PageRequest pr = PageRequest.of(page, size, sort);
            return exerciseRepository.findAll(spec, pr)
                    .map(this::convertToDto);
        }

        List<ExerciseResponseDto> all = exerciseRepository.findAll(spec).stream()
                .map(this::convertToDto)
                .toList();

        Comparator<ExerciseResponseDto> cmp = Comparator.comparingInt(ExerciseResponseDto::voteCount);
        if ("desc".equalsIgnoreCase(order)) {
            cmp = cmp.reversed();
        }

        List<ExerciseResponseDto> sorted = all.stream()
                .sorted(cmp)
                .toList();

        PageRequest pr = PageRequest.of(page, size, Sort.unsorted());
        int start = (int) pr.getOffset();
        int end = Math.min(start + pr.getPageSize(), sorted.size());
        List<ExerciseResponseDto> slice = start < end
                ? sorted.subList(start, end)
                : List.of();

        return new PageImpl<>(slice, pr, sorted.size());
    }

    public Exercise getExerciseByIdUtil(UUID id) {
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

        List<TestCaseResultDto> testCaseResults = new java.util.ArrayList<>();
        boolean allPassed = true;
        int testCaseCounter = 0;
        for (TestCase testCase : exercise.getTestCode()) {
            testCaseCounter++;
            ExecutionResultDto result = codeExecutionService.execute(
                    fullCode,
                    testCase.getInput(),
                    apiLanguageIdentifier);

            String output = result.output();
            String error = result.error();
            String expectedOutput = testCase.getExpectedOutput();
            boolean testPassed;

            if (error != null && !error.isEmpty()) {
                output = error;
                testPassed = false;
                allPassed = false;
            } else {
                String normalizedOutput = output.replaceAll("\\s+", "");
                String normalizedExpectedOutput = expectedOutput.replaceAll("\\s+", "");
                testPassed = normalizedOutput.equals(normalizedExpectedOutput);
                if (!testPassed) {
                    allPassed = false;
                }
            }

            TestCaseResultDto testCaseResult = new TestCaseResultDto(
                    testCaseCounter,
                    output,
                    expectedOutput,
                    testPassed);
            testCaseResults.add(testCaseResult);
        }

        String message = allPassed ? "Voce passou em todos os testes!" : "Voce nao passou em todos os testes. Veja os detalhes abaixo.";
        
        return new SolveResponseDto(
                testCaseResults,
                allPassed,
                message,
                testCaseResults.stream()
                        .map(TestCaseResultDto::getExpectedOutput)
                        .collect(Collectors.joining(", ")));
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
                exercise.getTestCode(),
                voteCount,
                ups,
                downs,
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

    @Transactional
    public void verifyExercise(UUID id) {
        Exercise ex = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado"));
        ex.setVerified(true);
        exerciseRepository.save(ex);
    }

    @Transactional
    public void deleteExercise(UUID id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado com o ID: " + id));
        
        // First, handle DailyChallenge dependencies (ChallengeResolution references DailyChallenge)
        dailyChallengeRepository.findByExercise(exercise).ifPresent(dailyChallenge -> {
            // Delete all challenge resolutions for this daily challenge
            challengeResolutionRepository.deleteAllByDailyChallenge(dailyChallenge);
            // Delete the daily challenge
            dailyChallengeRepository.delete(dailyChallenge);
        });
        
        // Remove exercise from all UserLists that contain it
        List<UserList> userListsWithExercise = userListRepository.findByExercisesContaining(exercise);
        userListsWithExercise.forEach(userList -> {
            userList.getExercises().remove(exercise);
            userListRepository.save(userList);
        });
        
        // Delete all votes for this exercise
        voteRepository.deleteAll(voteRepository.findAllByExercise(exercise));
        
        // TestCases will be deleted automatically due to CascadeType.ALL
        
        exerciseRepository.delete(exercise);
    }

    @Transactional(readOnly = true)
    public Page<ExerciseResponseDto> searchExercises(
            String q, String language, String difficulty,
            String sortBy, String order, int page, int size) {

        Specification<Exercise> spec = Specification
                .where(ExerciseSpecifications.containsTerm(q))
                .and(Optional.ofNullable(language)
                        .filter(l -> !l.isBlank() && !"all".equalsIgnoreCase(l))
                        .map(ExerciseSpecifications::hasLanguage)
                        .orElse(null))
                .and(Optional.ofNullable(difficulty)
                        .filter(d -> !d.isBlank())
                        .map(ExerciseSpecifications::hasDifficulty)
                        .orElse(null));

        if (!"votes".equalsIgnoreCase(sortBy)) {
            Sort.Direction dir = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Sort sort = Sort.by(dir, sortBy != null ? sortBy : "createdAt");
            PageRequest pr = PageRequest.of(page, size, sort);
            return exerciseRepository.findAll(spec, pr)
                    .map(this::convertToDto);
        }

        List<ExerciseResponseDto> all = exerciseRepository.findAll(spec).stream()
                .map(this::convertToDto)
                .toList();

        Comparator<ExerciseResponseDto> cmp = Comparator
                .comparingInt(ExerciseResponseDto::voteCount);
        if ("desc".equalsIgnoreCase(order)) {
            cmp = cmp.reversed();
        }

        List<ExerciseResponseDto> sorted = all.stream()
                .sorted(cmp)
                .toList();

        int start = page * size;
        int end = Math.min(start + size, sorted.size());
        List<ExerciseResponseDto> slice = (start < end) ? sorted.subList(start, end) : List.of();

        return new PageImpl<>(slice, PageRequest.of(page, size), sorted.size());
    }

}
