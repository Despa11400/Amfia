package com.theater.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/")
public class MainController {
    
    private static final Logger logger = LoggerFactory.getLogger(MainController.class);

    @GetMapping
    public ResponseEntity<String> home() {
        logger.info("Home endpoint called");
        return ResponseEntity.ok("Backend is running");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("Health check called");
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/error")
    public ResponseEntity<String> handleError() {
        return ResponseEntity.status(500).body("An error occurred");
    }
} 