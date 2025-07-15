package com.loopcode.loopcode.security;

import com.loopcode.loopcode.repositories.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override

    public UserDetails loadUserByUsername(String identifier)
            throws UsernameNotFoundException {
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + identifier));
    }
}