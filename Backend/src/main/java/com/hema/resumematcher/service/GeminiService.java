package com.hema.resumematcher.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class GeminiService {

    @Value("${app.gemini.api.key:YOUR_GEMINI_API_KEY}")
    private String apiKey;

    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeMatch(String resumeText, String jobDescription) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_GEMINI_API_KEY")) {
            return Map.of("score", 0.0, "rationale", "AI matching placeholder: Please provide a valid Gemini API key in application.properties.");
        }

        String prompt = "Act as a professional recruiter. Analyze the following resume against the job description. " +
                "Provide a match score (0-100) and a brief rationale (max 150 words). " +
                "Format the EXACT output as a valid JSON object: {\"score\": number, \"rationale\": \"string\"}. Do not include any other text or markdown.\n\n" +
                "RESUME:\n" + resumeText + "\n\nJOB DESCRIPTION:\n" + jobDescription;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL + apiKey, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                
                // Clean AI text if it wrapped in markdown
                aiText = aiText.replace("```json", "").replace("```", "").trim();
                
                JsonNode resultNode = objectMapper.readTree(aiText);
                return Map.of(
                    "score", resultNode.path("score").asDouble(),
                    "rationale", resultNode.path("rationale").asText()
                );
            }
        } catch (Exception e) {
            return Map.of("score", 0.0, "rationale", "AI Analysis Error: " + e.getMessage());
        }
        return Map.of("score", 0.0, "rationale", "AI analysis unavailable.");
    }
}
