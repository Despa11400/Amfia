package com.theater.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class MainController {
    
    @GetMapping("/")
    public String root() {
        return "Root endpoint working";
    }
    
    @GetMapping("/test")
    public String test() {
        return "Test endpoint working";
    }
} 