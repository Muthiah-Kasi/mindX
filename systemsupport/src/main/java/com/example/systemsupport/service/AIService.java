package com.example.systemsupport.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public String generateResponse(String query) {

        if (query == null || query.isBlank()) {
            return fallbackResponse(query);
        }

        try {
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "You are a helpful customer support assistant."));
            messages.add(Map.of("role", "user", "content", query));

            body.put("messages", messages);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

            return message.get("content").toString().trim();

        } catch (Exception e) {

            System.out.println("⚠️ OpenAI API Error: " + e.getMessage());

            // Detect quota exceeded
            if (e.getMessage() != null && e.getMessage().contains("quota")) {
                System.out.println("❌ OpenAI quota exceeded. Your credits may be finished.");
            }

            // Detect unauthorized
            if (e.getMessage() != null && e.getMessage().contains("401")) {
                System.out.println("❌ Invalid API key or unauthorized access.");
            }

            // Detect network issue
            if (e.getMessage() != null && e.getMessage().contains("Connection")) {
                System.out.println("❌ Network issue while calling OpenAI.");
            }

            System.out.println("➡️ Falling back to mock AI response...");

            return fallbackResponse(query);
        }
    }

    private String fallbackResponse(String query) {
        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("order")) {
            return "Please share your order ID";
        } else if (lowerQuery.contains("refund")) {
            return "We will connect you to support";
        } else {
            return "Our support team will assist you shortly";
        }
    }
}