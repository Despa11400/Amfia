package com.theater.controller;

import com.theater.model.Theater;
import com.theater.service.SupabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@CrossOrigin(origins = "*")
public class TheaterController {
    
    @Autowired
    private SupabaseService supabaseService;

    @GetMapping("/test")
    public ResponseEntity<?> testGet() {
        try {
            return ResponseEntity.ok("Theater API is working!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTheater(@RequestParam String name, @RequestParam String email) {
        try {
            System.out.println("Creating theater with name: " + name + " and email: " + email);
            Theater theater = new Theater();
            theater.setName(name);
            theater.setEmail(email);
            
            supabaseService.insertTheater(theater);
            return ResponseEntity.ok()
                .header("Content-Type", "text/html")
                .body("<html><body><h1>Theater created successfully!</h1>" +
                      "<p>Name: " + name + "</p>" +
                      "<p>Email: " + email + "</p>" +
                      "<a href='/api/theaters/list'>View all theaters</a></body></html>");
        } catch (Exception e) {
            System.out.println("Error creating theater: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error creating theater: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getTheaterList() {
        try {
            List<Theater> theaters = supabaseService.getTheaters();
            if (theaters.isEmpty()) {
                return ResponseEntity.ok("<html><body><h1>No theaters found</h1>" +
                                      "<a href='/api/theaters/new'>Create a theater</a></body></html>");
            }
            
            StringBuilder response = new StringBuilder("<html><body>");
            response.append("<h1>Theater List</h1>");
            response.append("<ul>");
            for (Theater theater : theaters) {
                response.append("<li>")
                       .append("Name: ").append(theater.getName())
                       .append(", Email: ").append(theater.getEmail())
                       .append("</li>");
            }
            response.append("</ul>");
            response.append("<a href='/api/theaters/new'>Create another theater</a>");
            response.append("</body></html>");
            
            return ResponseEntity.ok()
                .header("Content-Type", "text/html")
                .body(response.toString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error loading theaters: " + e.getMessage());
        }
    }

    @GetMapping("/new")
    public ResponseEntity<?> showCreateForm() {
        String html = """
            <html>
            <body>
                <h1>Create New Theater</h1>
                <form action="/api/theaters/create" method="post">
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" required>
                    </div>
                    <button type="submit">Create Theater</button>
                </form>
                <br>
                <a href='/api/theaters/list'>View all theaters</a>
            </body>
            </html>
            """;
        
        return ResponseEntity.ok()
            .header("Content-Type", "text/html")
            .body(html);
    }
} 