package com.hema.resumematcher.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userEmail, String message, String type) {
        // Send to a private topic for the specific user
        messagingTemplate.convertAndSendToUser(
                userEmail,
                "/topic/notifications",
                Map.of("message", message, "type", type)
        );
        
        // Also send to a general topic if needed (for demo purposes)
        messagingTemplate.convertAndSend("/topic/public", Map.of("message", message, "user", userEmail));
    }
}
