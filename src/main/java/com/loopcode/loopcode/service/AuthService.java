package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.exceptions.UserAlreadyExistsException;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;
import com.loopcode.loopcode.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public void register(RegisterRequestDto requestDto) {
        if (userRepository.existsByUsername(requestDto.username())|| (userRepository.existsByEmail(requestDto.email())))
            throw new UserAlreadyExistsException("Username or email already exists.");

        User newUser = new User();
        newUser.setUsername(requestDto.username());
        newUser.setEmail(requestDto.email());
        newUser.setPassword(passwordEncoder.encode(requestDto.password()));
        newUser.setRole(requestDto.role() != null ? requestDto.role() : Role.USER);
        newUser.setDaily_streak(0);

        userRepository.save(newUser);

    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto requestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDto.email(),
                        requestDto.password()));

        String jwtToken = jwtService.generateToken(authentication);

        return new AuthResponseDto(jwtToken);
    }
}