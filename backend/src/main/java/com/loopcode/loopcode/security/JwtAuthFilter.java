package com.loopcode.loopcode.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loopcode.loopcode.domain.ban.BanRecord;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.BanRecordRepository;
import com.loopcode.loopcode.repositories.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AppUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final BanRecordRepository banRecordRepository;
    private final ObjectMapper objectMapper;

    public JwtAuthFilter(JwtService jwtService, AppUserDetailsService userDetailsService, UserRepository userRepository, BanRecordRepository banRecordRepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.banRecordRepository = banRecordRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        System.out.println(">>>> Authorization header: " + request.getHeader("Authorization"));
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            Optional<User> optionalUser = userRepository.findByUsername(username);

            if(optionalUser.isPresent()){
                User user = optionalUser.get();

                Optional<BanRecord> activeBan = banRecordRepository.findByBannedUserAndActiveTrue(user);

                if(activeBan.isPresent()){
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");

                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Usuário banido.");
                    errorResponse.put("reason", activeBan.get().getBanReason());

                    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
                    return;
                }
            } else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setContentType("application/json");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Usuário do token não encontrado.");
                response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
                return;
            }

            if (jwtService.validateToken(jwt)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
