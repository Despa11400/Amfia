package com.theater.controller;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "*")
public class TestController {
    
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @GetMapping("/ping")
    public String ping() {
        logger.info("Ping endpoint called");
        return "pong";
    }
} 