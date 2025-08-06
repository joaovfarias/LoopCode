package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.ban.BanRecord;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.dtos.UserResponseDto;
import com.loopcode.loopcode.exceptions.UserAlreadyExistsException;
import com.loopcode.loopcode.exceptions.UserBannedException;
import com.loopcode.loopcode.repositories.BanRecordRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;
import com.loopcode.loopcode.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final BanRecordRepository banRecordRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager, BanRecordRepository banRecordRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.banRecordRepository = banRecordRepository;
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

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto requestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDto.email(),
                        requestDto.password()));

        // Check if user is banned after successful authentication
        User user = (User) authentication.getPrincipal();
        Optional<BanRecord> activeBan = banRecordRepository.findByBannedUserAndActiveTrue(user);
        
        if (activeBan.isPresent()) {
            throw new UserBannedException(activeBan.get().getBanReason());
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
                user.getDailyStreak());

    }
}