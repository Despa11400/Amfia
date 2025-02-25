package com.theater.controller;

import com.theater.model.Seat;
import com.theater.model.Reservation;
import com.theater.model.CancelRequest;
import com.theater.service.SupabaseService;
import com.theater.config.SupabaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SeatController {
    
    @Autowired
    private SupabaseService supabaseService;

    @GetMapping("/seats")
    public ResponseEntity<List<Seat>> getSeats() throws Exception {
        return ResponseEntity.ok(supabaseService.getAllSeats());
    }

    @PostMapping("/seats/reserve")
    public ResponseEntity<?> reserveSeats(@RequestBody Reservation reservation) throws Exception {
        supabaseService.reserveSeats(reservation);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/seats/cancel")
    public ResponseEntity<?> cancelReservation(@RequestBody CancelRequest request) throws Exception {
        System.out.println("Attempting to cancel reservation for seat: " + request.getSeatId());
        System.out.println("Student ID provided: " + request.getStudentId());
        
        boolean isOwner = supabaseService.verifyReservationOwnership(request.getSeatId(), request.getStudentId());
        System.out.println("Is owner verification result: " + isOwner);
        
        if (isOwner) {
            supabaseService.cancelReservation(request.getSeatId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).body("Unauthorized: Student ID does not match reservation");
    }

    @PostMapping("/seats/clear-all")
    public ResponseEntity<?> clearAll(@RequestHeader("Admin-Password") String password) throws Exception {
        System.out.println("Received password length: " + password.length());
        System.out.println("Expected password length: " + SupabaseConfig.ADMIN_PASSWORD.length());
        System.out.println("Received password bytes: " + password.getBytes("UTF-8"));
        System.out.println("Expected password bytes: " + SupabaseConfig.ADMIN_PASSWORD.getBytes("UTF-8"));
        
        // Try with explicit string comparison
        boolean matches = password.equals(SupabaseConfig.ADMIN_PASSWORD);
        System.out.println("Password matches: " + matches);
        
        if (matches) {
            supabaseService.clearAllReservations();
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).body("Invalid admin password");
    }

    @GetMapping("/test")
    public String test() {
        return "Backend is working!";
    }
} 