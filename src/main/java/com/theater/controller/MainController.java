package com.theater.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/")
public class MainController {
    
    private static final Logger logger = LoggerFactory.getLogger(MainController.class);

    @GetMapping(value = "/")
    public String home() {
        logger.info("Home endpoint called");
        return "Backend is running";
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("Health check called");
        return ResponseEntity.ok("OK");
    }

    @GetMapping(value = "/api/ping")
    public String ping() {
        logger.info("Ping endpoint called");
        return "pong";
    }

    // Add this test endpoint
    @GetMapping("/test-connection")
    public ResponseEntity<String> testConnection() {
        logger.info("Test connection endpoint called");
        try {
            return ResponseEntity.ok("Connection successful!");
        } catch (Exception e) {
            logger.error("Error in test connection", e);
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }
} 