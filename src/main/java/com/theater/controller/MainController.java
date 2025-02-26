package com.theater.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class MainController {

    @GetMapping(value = "/", produces = "text/plain")
    public String home() {
        return "Backend is running";
    }

    @GetMapping(value = "/health", produces = "text/plain")
    public String health() {
        return "OK";
    }

    @GetMapping(value = "/api/ping", produces = "text/plain")
    public String ping() {
        return "pong";
    }
} 