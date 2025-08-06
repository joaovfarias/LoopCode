package com.loopcode.loopcode.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.security.Role;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    
    Page<User> findByRole(Role role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u NOT IN " +
           "(SELECT b.bannedUser FROM BanRecord b WHERE b.active = true)")
    Page<User> findAllExcludingBanned(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u NOT IN " +
           "(SELECT b.bannedUser FROM BanRecord b WHERE b.active = true)")
    Page<User> findByRoleExcludingBanned(@Param("role") Role role, Pageable pageable);
}
