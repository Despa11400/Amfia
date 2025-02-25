package com.theater.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {
    
    @GetMapping("/error")
    public String handleError() {
        return "An error occurred. Please check your request.";
    }
} 