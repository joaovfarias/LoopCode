package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.user.UserList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserListRepository extends JpaRepository<UserList, Long> {
    Page<UserList> findByOwnerUsername(String username, Pageable pageable);

    java.util.Optional<UserList> findByIdAndOwnerUsername(Long id, String username);
}
