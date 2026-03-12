package com.hema.resumematcher.service;

import com.hema.resumematcher.config.JwtUtil;
import com.hema.resumematcher.dto.AuthResponse;
import com.hema.resumematcher.dto.LoginRequest;
import com.hema.resumematcher.dto.RegisterRequest;
import com.hema.resumematcher.entity.Role;
import com.hema.resumematcher.entity.User;
import com.hema.resumematcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor   // ← Spring injects via constructor; NO more = null bug
public class AuthService {

    private final UserRepository userRepository;  // ✅ FIXED: no = null
    private final PasswordEncoder passwordEncoder; // ✅ FIXED: no = null
    private final JwtUtil jwtUtil;

    // ── Register ──────────────────────────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // Validate role
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role. Use: ADMIN, RECRUITER, or CANDIDATE");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), "User registered successfully");
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), "Login successful");
    }
}
