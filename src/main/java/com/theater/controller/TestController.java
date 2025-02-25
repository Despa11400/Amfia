package com.theater.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/")
    public String root() {
        return "Root endpoint working";
    }
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello endpoint working";
    }
} 