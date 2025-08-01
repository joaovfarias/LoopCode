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

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
            String sortBy, // 'createdAt', 'votescount', etc.
            String order, // 'asc' ou 'desc'
            int page,
            int size) {

        // Sort.Direction sortDirection = "desc".equalsIgnoreCase(order) ?
        // Sort.Direction.DESC : Sort.Direction.ASC;
        // Sort sort = Sort.by(sortDirection, "createdAt");

        // PageRequest pageable = PageRequest.of(page, size, sort);

        Specification<Exercise> spec = Specification
                .allOf(Optional.ofNullable(language)
                        .filter(l -> !l.isBlank() && !"all".equalsIgnoreCase(l))
                        .map(ExerciseSpecifications::hasLanguage)
                        .orElse(null))
                .and(Optional.ofNullable(difficulty)
                        .filter(d -> !d.isBlank())
                        .map(ExerciseSpecifications::hasDifficulty)
                        .orElse(null));

        boolean isGlobal = "votes".equalsIgnoreCase(sortBy);
        if (!isGlobal) {
            Sort.Direction dir = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Sort sort = Sort.by(dir, sortBy != null ? sortBy : "createdAt");
            PageRequest pr = PageRequest.of(page, size, sort);
            return exerciseRepository.findAll(spec, pr)
                    .map(this::convertToDto);
        }

        List<ExerciseResponseDto> all = exerciseRepository.findAll(spec)
                .stream()
                .map(this::convertToDto)
                .toList();

        Comparator<ExerciseResponseDto> cmp = Comparator.comparingInt(ExerciseResponseDto::voteCount)
                .reversed();
        if ("asc".equalsIgnoreCase(order)) {
            cmp = cmp.reversed();
        }
        all.sort(cmp);

        int start = page * size;
        int end = Math.min(start + size, all.size());
        List<ExerciseResponseDto> slice = (start < end) ? all.subList(start, end) : List.of();

        return new PageImpl<>(slice, PageRequest.of(page, size), all.size());
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

    @Transactional
    public void verifyExercise(UUID id) {
        Exercise ex = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado"));
        ex.setVerified(true);
        exerciseRepository.save(ex);
    }

    @Transactional(readOnly = true)
    public Page<ExerciseResponseDto> searchExercises(
            String q, String language, String difficulty,
            String sortBy, String order, int page, int size) {

        // Sort.Direction dir = "desc".equalsIgnoreCase(order)
        // ? Sort.Direction.DESC
        // : Sort.Direction.ASC;
        // Sort baseSort = Sort.by(dir, "createdAt");
        // PageRequest pr = PageRequest.of(page, size, baseSort);

        Specification<Exercise> spec = Specification
                .allOf(ExerciseSpecifications.containsTerm(q))
                .and(Optional.ofNullable(language)
                        .filter(l -> !l.isBlank() && !"all".equalsIgnoreCase(l))
                        .map(ExerciseSpecifications::hasLanguage)
                        .orElse(null))
                .and(Optional.ofNullable(difficulty)
                        .filter(d -> !d.isBlank())
                        .map(ExerciseSpecifications::hasDifficulty)
                        .orElse(null));

        // Page<Exercise> page0 = exerciseRepository.findAll(spec, pr);
        // Page<ExerciseResponseDto> dtos0 = page0.map(this::convertToDto);

        boolean isGlobal = "votes".equalsIgnoreCase(sortBy);
        if (!isGlobal) {
            Sort.Direction dir = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
            Sort sort = Sort.by(dir, sortBy != null ? sortBy : "createdAt");
            PageRequest pr = PageRequest.of(page, size, sort);
            return exerciseRepository.findAll(spec, pr)
                    .map(this::convertToDto);
        }

        List<ExerciseResponseDto> all = exerciseRepository.findAll(spec)
                .stream()
                .map(this::convertToDto)
                .toList();

        Comparator<ExerciseResponseDto> cmp = Comparator.comparingInt(ExerciseResponseDto::voteCount)
                .reversed();
        if ("asc".equalsIgnoreCase(order)) {
            cmp = cmp.reversed();
        }
        all.sort(cmp);

        int start = page * size;
        int end = Math.min(start + size, all.size());
        List<ExerciseResponseDto> slice = (start < end) ? all.subList(start, end) : List.of();

        return new PageImpl<>(slice, PageRequest.of(page, size), all.size());
    }

}
