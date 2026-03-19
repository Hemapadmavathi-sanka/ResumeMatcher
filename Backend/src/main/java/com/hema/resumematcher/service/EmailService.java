package com.hema.resumematcher.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationOtp(String to, String otp) {
        sendEmail(to, "Verify Your Resume Matcher Account", "Welcome to Resume Matcher!\n\n" +
                "Your One-Time Password (OTP) for account verification is: " + otp + "\n\n" +
                "Please enter this code to complete your registration.\n\n" +
                "Thanks,\nThe Resume Matcher Team", otp);
    }

    public void sendPasswordResetOtp(String to, String otp) {
        sendEmail(to, "Password Reset - Resume Matcher", "Hello,\n\n" +
                "You requested to reset your password. Your One-Time Password (OTP) is: " + otp + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Thanks,\nThe Resume Matcher Team", otp);
    }

    private void sendEmail(String to, String subject, String text, String otpFallback) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            // Fallback for testing
            System.err.println("Fallback OTP for " + to + ": " + otpFallback);
        }
    }
}
