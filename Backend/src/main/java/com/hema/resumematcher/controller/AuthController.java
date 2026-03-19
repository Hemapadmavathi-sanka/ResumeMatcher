package com.hema.resumematcher.controller;

import com.hema.resumematcher.dto.AuthResponse;
import com.hema.resumematcher.dto.ForgotPasswordRequest;
import com.hema.resumematcher.dto.LoginRequest;
import com.hema.resumematcher.dto.RegisterRequest;
import com.hema.resumematcher.dto.ResetPasswordRequest;
import com.hema.resumematcher.dto.VerifyOtpRequest;
import com.hema.resumematcher.entity.User;
import org.springframework.security.core.Authentication;
import com.hema.resumematcher.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request.getEmail(), request.getOtp()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request.getEmail()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword()));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(Authentication auth) {
        return ResponseEntity.ok(authService.getUserByEmail(auth.getName()));
    }
}
