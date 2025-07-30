package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.user.UserList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserListRepository extends JpaRepository<UserList, Long> {
    List<UserList> findByOwnerUsername(String username);

    java.util.Optional<UserList> findByIdAndOwnerUsername(Long id, String username);

}
