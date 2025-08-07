package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.timeout.TimeoutRecord;
import com.loopcode.loopcode.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TimeoutRecordRepository extends JpaRepository<TimeoutRecord, Long>, JpaSpecificationExecutor<TimeoutRecord> {
    Optional<TimeoutRecord> findByTimedOutUserAndActiveTrue(User timedOutUser);
    
    Page<TimeoutRecord> findByActiveTrue(Pageable pageable);
    
    Page<TimeoutRecord> findByActiveFalse(Pageable pageable);
    
    Page<TimeoutRecord> findAllByOrderByTimeoutDateDesc(Pageable pageable);
}