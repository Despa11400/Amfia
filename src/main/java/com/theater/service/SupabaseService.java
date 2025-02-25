package com.theater.service;

import com.theater.config.SupabaseConfig;
import com.theater.model.Theater;
import com.theater.model.User;
import com.theater.model.Seat;
import com.theater.model.Reservation;
import org.springframework.stereotype.Service;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Properties;

@Service
public class SupabaseService {
    private final String url;
    private final Properties props;

    public SupabaseService() {
        this.url = String.format("jdbc:postgresql://%s:%s/%s",
                               SupabaseConfig.DB_HOST,
                               SupabaseConfig.DB_PORT,
                               SupabaseConfig.DB_NAME);

        props = new Properties();
        props.setProperty("user", SupabaseConfig.DB_USER);
        props.setProperty("password", SupabaseConfig.DB_PASSWORD);
        props.setProperty("sslmode", "require");
        props.setProperty("ssl", "true");
        props.setProperty("sslfactory", "org.postgresql.ssl.NonValidatingFactory");
        
        System.out.println("Initializing database connection with URL: " + url);
    }

    public void testConnection() throws SQLException {
        try {
            System.out.println("Testing connection...");
            Connection conn = DriverManager.getConnection(url, props);
            System.out.println("Connection successful!");
            conn.close();
        } catch (SQLException e) {
            System.out.println("Connection failed!");
            System.out.println("Error: " + e.getMessage());
            System.out.println("SQL State: " + e.getSQLState());
            throw e;
        }
    }

    public String getUrl() {
        return url;
    }

    public void insertUser(User user) throws Exception {
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail());
            stmt.executeUpdate();
        }
    }

    public List<User> getUsers() throws Exception {
        List<User> users = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "SELECT name, email FROM users";
            PreparedStatement stmt = conn.prepareStatement(sql);
            var rs = stmt.executeQuery();
            while (rs.next()) {
                User user = new User();
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                users.add(user);
            }
        }
        return users;
    }

    public List<Theater> getTheaters() throws Exception {
        List<Theater> theaters = new ArrayList<>();
        System.out.println("Attempting to get theaters...");
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "SELECT id, name, email FROM theaters";
            PreparedStatement stmt = conn.prepareStatement(sql);
            var rs = stmt.executeQuery();
            while (rs.next()) {
                Theater theater = new Theater();
                theater.setId(rs.getString("id"));
                theater.setName(rs.getString("name"));
                theater.setEmail(rs.getString("email"));
                theaters.add(theater);
                System.out.println("Found theater: " + theater.getName());
            }
            System.out.println("Total theaters found: " + theaters.size());
            return theaters;
        } catch (SQLException e) {
            System.out.println("Error getting theaters: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void insertTheater(Theater theater) throws Exception {
        System.out.println("\nAttempting to insert theater...");
        System.out.println("Connection URL: " + url);
        System.out.println("Theater name: " + theater.getName());
        System.out.println("Theater email: " + theater.getEmail() + "\n");

        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "INSERT INTO theaters (name, email) VALUES (?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, theater.getName());
            stmt.setString(2, theater.getEmail());
            stmt.executeUpdate();
            System.out.println("Theater inserted successfully!");
        } catch (SQLException e) {
            System.out.println("SQL Error Code: " + e.getErrorCode());
            System.out.println("SQL State: " + e.getSQLState());
            System.out.println("Error Message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<Seat> getAllSeats() throws Exception {
        List<Seat> seats = new ArrayList<>();
        System.out.println("Attempting to get all seats...");
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "SELECT * FROM seats ORDER BY section, row, seat_column";
            System.out.println("Executing SQL: " + sql);
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Seat seat = new Seat();
                seat.setId(rs.getString("id"));
                seat.setSection(rs.getString("section"));
                seat.setRow(rs.getString("row"));
                seat.setColumn(rs.getInt("seat_column"));
                seat.setBooked(rs.getBoolean("booked"));
                seat.setStudentName(rs.getString("student_name"));
                seat.setStudentId(rs.getString("student_id"));
                seat.setFaculty(rs.getString("faculty"));
                seats.add(seat);
                System.out.println("Found seat: Section " + seat.getSection() + 
                                 ", Row " + seat.getRow() + 
                                 ", Column " + seat.getColumn());
            }
            System.out.println("Total seats found: " + seats.size());
            return seats;
        } catch (SQLException e) {
            System.out.println("Error getting seats: " + e.getMessage());
            System.out.println("SQL State: " + e.getSQLState());
            e.printStackTrace();
            throw e;
        }
    }

    public void reserveSeats(Reservation reservation) throws Exception {
        System.out.println("\nAttempting to reserve seats...");
        System.out.println("Customer Name: " + reservation.getCustomerName());
        System.out.println("Student ID: " + reservation.getStudentId());
        System.out.println("Faculty: " + reservation.getFaculty());
        System.out.println("Number of seats: " + reservation.getSeats().size());

        try (Connection conn = DriverManager.getConnection(url, props)) {
            conn.setAutoCommit(false);
            try {
                String sql = """
                    UPDATE seats 
                    SET booked = true, 
                        student_name = ?, 
                        student_id = ?, 
                        faculty = ? 
                    WHERE id::text = ? AND booked = false
                    """;
                
                System.out.println("SQL: " + sql);
                PreparedStatement stmt = conn.prepareStatement(sql);
                
                for (Seat seat : reservation.getSeats()) {
                    System.out.println("Reserving seat ID: " + seat.getId());
                    stmt.setString(1, reservation.getCustomerName());
                    stmt.setString(2, reservation.getStudentId());
                    stmt.setString(3, reservation.getFaculty());
                    stmt.setString(4, seat.getId());
                    
                    int updated = stmt.executeUpdate();
                    System.out.println("Rows updated: " + updated);
                    
                    if (updated == 0) {
                        throw new Exception("Seat " + seat.getId() + " is already booked");
                    }
                }
                conn.commit();
                System.out.println("Reservation completed successfully!");
            } catch (Exception e) {
                System.out.println("Error during reservation: " + e.getMessage());
                conn.rollback();
                throw e;
            }
        }
    }

    public void clearAllReservations() throws Exception {
        System.out.println("Attempting to clear all reservations...");
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = """
                UPDATE seats 
                SET booked = false, 
                    student_name = NULL, 
                    student_id = NULL, 
                    faculty = NULL
                """;
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            int updatedRows = stmt.executeUpdate();
            System.out.println("Cleared " + updatedRows + " reservations");
        } catch (SQLException e) {
            System.out.println("Error clearing reservations: " + e.getMessage());
            throw e;
        }
    }

    public boolean verifyReservationOwnership(String seatId, String studentId) throws Exception {
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "SELECT student_id FROM seats WHERE id::text = ? AND booked = true";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, seatId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                String reservedStudentId = rs.getString("student_id");
                return studentId.equals(reservedStudentId);
            }
            return false;
        }
    }

    public void cancelReservation(String seatId) throws Exception {
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = """
                UPDATE seats 
                SET booked = false, 
                    student_name = NULL, 
                    student_id = NULL, 
                    faculty = NULL 
                WHERE id::text = ?
                """;
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, seatId);
            stmt.executeUpdate();
        }
    }

    public boolean hasExistingReservation(String studentId) throws Exception {
        try (Connection conn = DriverManager.getConnection(url, props)) {
            String sql = "SELECT COUNT(*) FROM seats WHERE student_id = ? AND booked = true";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, studentId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                return count > 0;
            }
            return false;
        }
    }
} 