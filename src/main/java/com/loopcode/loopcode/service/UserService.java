package com.loopcode.loopcode.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.exceptions.UserAlreadyExistsException;
import com.loopcode.loopcode.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public void register(RegisterRequestDto dto)
    {
        if (userRepository.findByUsername(dto.username()).isPresent() || userRepository.findByEmail(dto.email()).isPresent()){
            throw new UserAlreadyExistsException("This account may already be in use.");
        }

        String encodedString = passwordEncoder.encode(dto.password());

        User newUser = new User();
        newUser.setUsername(dto.username());
        newUser.setPassword(encodedString);
        newUser.setEmail(dto.email());

        userRepository.save(newUser);

    }
}
