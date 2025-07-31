package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.ban.BanRecord;
import com.loopcode.loopcode.domain.timeout.TimeoutRecord;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.domain.user.UserList;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.exercise.Vote;
import com.loopcode.loopcode.dtos.BanRequestDto;
import com.loopcode.loopcode.dtos.TimeoutRequestDto;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.exceptions.ResourceNotFoundException;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.LanguageDto;
import com.loopcode.loopcode.dtos.SimpleUserDto;
import com.loopcode.loopcode.repositories.BanRecordRepository;
import com.loopcode.loopcode.repositories.TimeoutRecordRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.repositories.UserListRepository;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.VoteRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        private TimeoutRecordRepository timeoutRecordRepository;

        @Autowired
        private ExerciseRepository exerciseRepository;

        @Autowired
        private UserListRepository userListRepository;

        @Autowired
        private VoteRepository voteRepository;

        public UserService(UserRepository userRepository,
                        UserListRepository userListRepository,
                        BanRecordRepository banRecordRepository, TimeoutRecordRepository timeoutRecordRepository,
                        ExerciseRepository exerciseRepository, VoteRepository voteRepository) {
                this.userRepository = userRepository;
                this.userListRepository = userListRepository;
                this.banRecordRepository = banRecordRepository;
                this.timeoutRecordRepository = timeoutRecordRepository;
                this.voteRepository = voteRepository;

        }

        @Transactional(readOnly = true)
        public UserResponseDto getUserByUsername(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado."));

                return new UserResponseDto(
                                user.getUsername(),
                                user.getEmail(),
                                user.getRole().name(),
                                user.getDaily_streak());
        }

        @Transactional
        public void banUser(String usernameToBan, BanRequestDto banRequestDto) {
                User userToBan = userRepository.findByUsername(usernameToBan)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário a ser banido não encontrado."));
                Optional<BanRecord> existingActiveBan = banRecordRepository.findByBannedUserAndActiveTrue(userToBan);
                if (existingActiveBan.isPresent()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Usuário já possui um banimento ativo.");
                }

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String adminUsername = authentication.getName();
                User adminUser = userRepository.findByUsername(adminUsername)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Administrador não encontrado."));

                // registro do banimento
                BanRecord banRecord = new BanRecord();
                banRecord.setBannedUser(userToBan);
                banRecord.setAdminUser(adminUser);
                banRecord.setBanReason(banRequestDto.getBanReason());
                banRecord.setBanDate(LocalDateTime.now());
                banRecord.setActive(true);
                banRecordRepository.save(banRecord);
        }

        @Transactional
        public void unbanUser(String usernameToUnban) {
                User userToUnban = userRepository.findByUsername(usernameToUnban)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário a ser desbanido não encontrado."));

                BanRecord activeBan = banRecordRepository.findByBannedUserAndActiveTrue(userToUnban)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Usuário não possui um banimento ativo para ser desbanido."));

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String adminUsername = authentication.getName();
                User adminUser = userRepository.findByUsername(adminUsername)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Administrador não encontrado."));

                activeBan.setActive(false);
                activeBan.setUnbanDate(LocalDateTime.now());
                banRecordRepository.save(activeBan);
        }

        @Transactional
        public void applyTimeout(String usernameToTimeout, TimeoutRequestDto timeoutRequestDto) {
                User userToTimeout = userRepository.findByUsername(usernameToTimeout)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado."));

                timeoutRecordRepository.findByTimedOutUserAndActiveTrue(userToTimeout).ifPresent(oldTimeout -> {
                        oldTimeout.setActive(false);
                        timeoutRecordRepository.save(oldTimeout);
                });

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String adminUsername = authentication.getName();
                User adminUser = userRepository.findByUsername(adminUsername)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Administrador não encontrado."));

                // registra o timeout
                TimeoutRecord timeoutRecord = new TimeoutRecord();
                timeoutRecord.setTimedOutUser(userToTimeout);
                timeoutRecord.setAdminUser(adminUser);
                timeoutRecord.setReason(timeoutRequestDto.getReason());
                timeoutRecord.setTimeoutDate(LocalDateTime.now());
                timeoutRecord.setDurationMinutes(timeoutRequestDto.getDurationMinutes());
                timeoutRecord.setActive(true);
                timeoutRecordRepository.save(timeoutRecord);
        }

        @Transactional
        public void removeTimeout(String usernameToClearTimeout) {
                User userToClearTimeout = userRepository.findByUsername(usernameToClearTimeout)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado."));

                TimeoutRecord activeTimeout = timeoutRecordRepository
                                .findByTimedOutUserAndActiveTrue(userToClearTimeout)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Usuário não possui um timeout ativo para ser removido."));

                activeTimeout.setActive(false);
                timeoutRecordRepository.save(activeTimeout);
        }

        @Transactional(readOnly = true)
        public Page<ExerciseResponseDto> getExercisesByUsername(String username, Pageable pageable) {
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

                Page<Exercise> exercises = exerciseRepository.findByCreatedBy(user, pageable);

                return exercises.map(exercise -> {
                        int ups = (int) voteRepository.countByExerciseAndVotoValue(exercise, +1);
                        int downs = (int) voteRepository.countByExerciseAndVotoValue(exercise, -1);
                        int voteCount = ups - downs;

                        int userVote = voteRepository.findByExerciseAndUser(exercise, user)
                                .map(Vote::getValue)
                                .orElse(0);

                        return new ExerciseResponseDto(
                                exercise.getId(),
                                exercise.getTitle(),
                                new LanguageDto(
                                        exercise.getProgrammingLanguage().getId(),
                                        exercise.getProgrammingLanguage().getName()),
                                exercise.getDifficulty().name(),
                                exercise.getDescription(),
                                new SimpleUserDto(exercise.getCreatedBy().getUsername()),
                                exercise.isVerified(),
                                exercise.getCreatedAt(),
                                exercise.getMainCode(),
                                exercise.getTestCode(),
                                voteCount,
                                ups,
                                downs,
                                userVote);
                });
        }
}
