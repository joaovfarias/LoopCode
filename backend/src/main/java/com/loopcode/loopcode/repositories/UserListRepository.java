package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.user.UserList;
import com.loopcode.loopcode.domain.exercise.Exercise;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserListRepository extends JpaRepository<UserList, Long>, JpaSpecificationExecutor<UserList> {
    Page<UserList> findByOwnerUsername(String username, Pageable pageable);

    java.util.Optional<UserList> findByIdAndOwnerUsername(Long id, String username);
    
    List<UserList> findByExercisesContaining(Exercise exercise);
}
