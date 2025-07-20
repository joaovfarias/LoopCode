package com.loopcode.loopcode.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.loopcode.loopcode.security.Role;

public record RegisterRequestDto(
    
    @NotBlank(message = "Username is required.")
    String username,

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    String email,

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must have atleast 8 characters.")
    String password,

    Role role

){}
