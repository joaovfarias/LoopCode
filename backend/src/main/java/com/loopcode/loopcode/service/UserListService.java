package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.user.UserList;
import com.loopcode.loopcode.dtos.CreateUserListDto;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.exceptions.ResourceNotFoundException;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.UserListRepository;
import com.loopcode.loopcode.repositories.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserListService {

        private final UserRepository userRepository;
        private final ExerciseRepository exerciseRepository;
        private final UserListRepository userListRepository;
        private final ExerciseService exerciseService;

        public UserListService(UserRepository userRepository,
                        ExerciseRepository exerciseRepository,
                        UserListRepository userListRepository,
                        ExerciseService exerciseService) {
                this.userRepository = userRepository;
                this.exerciseRepository = exerciseRepository;
                this.userListRepository = userListRepository;
                this.exerciseService = exerciseService;
        }

        @Transactional
        public UserListDto createList(String username, CreateUserListDto dto) {
                User owner = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + username));

                UserList list = new UserList();
                list.setName(dto.name());
                list.setOwner(owner);
                list.setDescription(dto.description());

                dto.exerciseIds().forEach(id -> {
                        Exercise ex = exerciseRepository.findById(id)
                                        .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado: " + id));
                        list.getExercises().add(ex);
                });

                UserList saved = userListRepository.save(list);
                return toDto(saved);
        }

        @Transactional(readOnly = true)
        public Page<UserListDto> getAllLists(Pageable pageable) {
                return userListRepository.findAll(pageable)
                                .map(this::toDto);
        }

        @Transactional(readOnly = true)
        public UserListDto getListById(Long listId) {
                UserList list = userListRepository.findById(listId)
                                .orElseThrow(() -> new ResourceNotFoundException("Lista não encontrada: " + listId));

                List<ExerciseResponseDto> fullExercises = list.getExercises().stream()
                                .map(e -> exerciseService.getExerciseById(e.getId()))
                                .collect(Collectors.toList());

                return new UserListDto(
                                list.getId(),
                                list.getName(),
                                list.getDescription(),
                                list.getCreatedAt(),
                                list.getOwner().getUsername(),
                                fullExercises);
        }

        @Transactional(readOnly = true)
        public Page<UserListDto> getListsByUsername(String ownerUsername, Pageable pageable) {
                userRepository.findByUsername(ownerUsername)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuário não encontrado: " + ownerUsername));

                return userListRepository.findByOwnerUsername(ownerUsername, pageable)
                                .map(list -> {
                                        List<ExerciseResponseDto> fullExercises = list.getExercises().stream()
                                                        .map(e -> exerciseService.getExerciseById(e.getId()))
                                                        .collect(Collectors.toList());
                                        return new UserListDto(
                                                        list.getId(),
                                                        list.getName(),
                                                        list.getDescription(),
                                                        list.getCreatedAt(),
                                                        ownerUsername,
                                                        fullExercises);
                                });
        }

        private UserListDto toDto(UserList list) {
                List<ExerciseResponseDto> fullExercises = list.getExercises().stream()
                                .map(e -> exerciseService.getExerciseById(e.getId()))
                                .collect(Collectors.toList());

                return new UserListDto(
                                list.getId(),
                                list.getName(),
                                list.getDescription(),
                                list.getCreatedAt(),
                                list.getOwner().getUsername(),
                                fullExercises);
        }

        @Transactional(readOnly = true)
        public Page<UserListDto> searchLists(
                        String q, 
                        int listPage, int listSize) {

                Specification<UserList> spec = (root, query, cb) -> {
                        String like = "%" + q.toLowerCase() + "%";
                        return cb.or(
                                cb.like(cb.lower(root.get("name")), like),
                                cb.like(cb.lower(root.get("owner")), like)
                        );
                };

                Pageable pageable = PageRequest.of(listPage, listSize);
                return userListRepository.findAll(spec, pageable)
                                .map(this::toDto);
        }

        @Transactional
        public void deleteList(Long listId) {
                UserList list = userListRepository.findById(listId)
                                .orElseThrow(() -> new ResourceNotFoundException("Lista não encontrada: " + listId));
                userListRepository.delete(list);
        }

}
