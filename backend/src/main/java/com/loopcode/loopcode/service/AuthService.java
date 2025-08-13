package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.ban.BanRecord;
import com.loopcode.loopcode.domain.timeout.TimeoutRecord;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.exceptions.UserAlreadyExistsException;
import com.loopcode.loopcode.exceptions.UserBannedException;
import com.loopcode.loopcode.exceptions.UserTimeoutException;
import com.loopcode.loopcode.repositories.BanRecordRepository;
import com.loopcode.loopcode.repositories.TimeoutRecordRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;
import com.loopcode.loopcode.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final BanRecordRepository banRecordRepository;
    private final TimeoutRecordRepository timeoutRecordRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager, BanRecordRepository banRecordRepository, 
            TimeoutRecordRepository timeoutRecordRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.banRecordRepository = banRecordRepository;
        this.timeoutRecordRepository = timeoutRecordRepository;
    }

    @Transactional
    public void register(RegisterRequestDto requestDto) {
        if (userRepository.existsByUsername(requestDto.username())
                || (userRepository.existsByEmail(requestDto.email())))
            throw new UserAlreadyExistsException("Username or email already exists.");

        User newUser = new User();
        newUser.setUsername(requestDto.username());
        newUser.setEmail(requestDto.email());
        newUser.setPassword(passwordEncoder.encode(requestDto.password()));
        newUser.setRole(requestDto.role() != null ? requestDto.role() : Role.USER);
        newUser.setDailyStreak(0);

        userRepository.save(newUser);

    }

    @Transactional
    public AuthResponseDto login(LoginRequestDto requestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDto.email(),
                        requestDto.password()));

        // Check if user is banned or timed out after successful authentication
        User user = (User) authentication.getPrincipal();
        
        // Check for permanent ban first
        Optional<BanRecord> activeBan = banRecordRepository.findByBannedUserAndActiveTrue(user);
        if (activeBan.isPresent()) {
            throw new UserBannedException(activeBan.get().getBanReason());
        }
        
        // Check for timeout
        Optional<TimeoutRecord> activeTimeout = timeoutRecordRepository.findByTimedOutUserAndActiveTrue(user);
        if (activeTimeout.isPresent()) {
            TimeoutRecord timeout = activeTimeout.get();
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime timeoutEndDate = timeout.getTimeoutEndDate();
            
            // If timeout has expired, deactivate it and allow login
            if (timeoutEndDate != null && now.isAfter(timeoutEndDate)) {
                timeout.setActive(false);
                timeoutRecordRepository.save(timeout);
            } else {
                // Timeout is still active, throw exception with timeout details
                throw new UserTimeoutException(timeout.getReason(), timeoutEndDate);
            }
        }

        String jwtToken = jwtService.generateToken(authentication);

        return new AuthResponseDto(jwtToken);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return new UserResponseDto(
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getDailyStreak(),
                0
                );

    }
}