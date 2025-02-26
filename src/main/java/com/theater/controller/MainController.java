package com.theater.controller;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "*")
public class MainController {
    
    private static final Logger logger = LoggerFactory.getLogger(MainController.class);

    @GetMapping(value = "/")
    public String home() {
        logger.info("Home endpoint called");
        return "Backend is running";
    }

    @GetMapping(value = "/health")
    public String health() {
        logger.info("Health check called");
        return "OK";
    }

    @GetMapping(value = "/api/ping")
    public String ping() {
        logger.info("Ping endpoint called");
        return "pong";
    }

    // Add this test endpoint
    @GetMapping("/test-connection")
    public String testConnection() {
        logger.info("Test connection endpoint called");
        return "Connection successful!";
    }
} 