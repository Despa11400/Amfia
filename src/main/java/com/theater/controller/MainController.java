package com.theater.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class MainController {

    @GetMapping("/")
    public String home() {
        return "Backend is running";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @GetMapping("/api/ping")
    public String ping() {
        return "pong";
    }
} 