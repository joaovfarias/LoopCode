package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.ban.BanRecord;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.dtos.BanRequestDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.LanguageDto;
import com.loopcode.loopcode.dtos.SimpleUserDto;
import com.loopcode.loopcode.repositories.BanRecordRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.repositories.ExerciseRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BanRecordRepository banRecordRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public UserResponseDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        
        return new UserResponseDto(
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            user.getDaily_streak()
        );
    }
    @Transactional
    public void banUser(String usernameToBan, BanRequestDto banRequestDto) {
        User userToBan = userRepository.findByUsername(usernameToBan)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário a ser banido não encontrado."));
        Optional<BanRecord> existingActiveBan = banRecordRepository.findByBannedUserAndActiveTrue(userToBan);
        if (existingActiveBan.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário já possui um banimento ativo.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminUsername = authentication.getName();
        User adminUser = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Administrador não encontrado."));

        //novo registro de banimento
        BanRecord banRecord = new BanRecord();
        banRecord.setBannedUser(userToBan);
        banRecord.setAdminUser(adminUser);
        banRecord.setBanReason(banRequestDto.getBanReason());
        banRecord.setBanDate(LocalDateTime.now());
        banRecord.setActive(true); // marcar como ativo
        banRecordRepository.save(banRecord);
    }

    @Transactional
    public void unbanUser(String usernameToUnban) {
        User userToUnban = userRepository.findByUsername(usernameToUnban)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário a ser desbanido não encontrado."));

        // Encontrar o banimento ativo para desativar
        BanRecord activeBan = banRecordRepository.findByBannedUserAndActiveTrue(userToUnban)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não possui um banimento ativo para ser desbanido."));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminUsername = authentication.getName();
        User adminUser = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Administrador não encontrado."));

        activeBan.setActive(false);
        activeBan.setUnbanDate(LocalDateTime.now());
        // Opcional: registrar quem desbaniu, se necessário adicionar um campo ao BanRecord para isso
        banRecordRepository.save(activeBan);

    }

    @Transactional(readOnly = true)
    public List<ExerciseResponseDto> getExercisesByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        
        List<Exercise> exercises = exerciseRepository.findByCreatedBy(user);
        
        return exercises.stream()
                .map(exercise -> new ExerciseResponseDto(
                    exercise.getId(),
                    exercise.getTitle(),
                    new LanguageDto(
                        exercise.getProgrammingLanguage().getId(),
                        exercise.getProgrammingLanguage().getName()
                    ),
                    exercise.getDifficulty().name(),
                    exercise.getDescription(),
                    new SimpleUserDto(
                        exercise.getCreatedBy().getUsername()
                    ),
                    exercise.isVerified(),
                    exercise.getCreatedAt(),
                    exercise.getMainCode(),
                    exercise.getTestCode()
                ))
                .toList();
    }
}
