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
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class SeatController {
    
    @Autowired
    private SupabaseService supabaseService;

    @GetMapping
    public ResponseEntity<?> getAllSeats() {
        try {
            System.out.println("Getting all seats...");
            List<Seat> seats = supabaseService.getAllSeats();
            System.out.println("Found " + seats.size() + " seats");
            return ResponseEntity.ok(seats);
        } catch (Exception e) {
            System.out.println("Error in getAllSeats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body("Error getting seats: " + e.getMessage());
        }
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveSeats(@RequestBody Reservation reservation) {
        try {
            System.out.println("Received reservation request:");
            System.out.println("Customer Name: " + reservation.getCustomerName());
            System.out.println("Student ID: " + reservation.getStudentId());
            System.out.println("Faculty: " + reservation.getFaculty());
            System.out.println("Selected Seats: " + reservation.getSeats().size());

            // Check if student already has a reservation
            if (supabaseService.hasExistingReservation(reservation.getStudentId())) {
                return ResponseEntity.status(400)
                    .body("Error: You already have a reservation. Only one seat per student is allowed.");
            }

            // Check if trying to reserve multiple seats
            if (reservation.getSeats().size() > 1) {
                return ResponseEntity.status(400)
                    .body("Error: You can only reserve one seat at a time.");
            }
            
            supabaseService.reserveSeats(reservation);
            return ResponseEntity.ok().body("Reservation successful");
        } catch (Exception e) {
            System.out.println("Error in reserveSeats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error reserving seats: " + e.getMessage());
        }
    }

    @PostMapping("/clear-all")
    public ResponseEntity<?> clearAllReservations(@RequestHeader("Admin-Password") String password) {
        try {
            if (!SupabaseConfig.ADMIN_PASSWORD.equals(password)) {
                return ResponseEntity.status(403).body("Unauthorized: Invalid admin password");
            }
            
            supabaseService.clearAllReservations();
            return ResponseEntity.ok("All reservations cleared successfully");
        } catch (Exception e) {
            System.out.println("Error in clearAllReservations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error clearing reservations: " + e.getMessage());
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelReservation(@RequestBody CancelRequest request) {
        try {
            System.out.println("\nReceived cancel request:");
            System.out.println("Seat ID: " + request.getSeatId());
            System.out.println("Student ID: " + request.getStudentId());
            
            if (supabaseService.verifyReservationOwnership(request.getSeatId(), request.getStudentId())) {
                supabaseService.cancelReservation(request.getSeatId());
                return ResponseEntity.ok("Reservation cancelled successfully");
            } else {
                return ResponseEntity.status(403)
                    .body("Unauthorized: Student ID does not match reservation");
            }
        } catch (Exception e) {
            System.out.println("Error in cancelReservation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error cancelling reservation: " + e.getMessage());
        }
    }
} 