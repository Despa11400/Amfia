package com.theater.model;

import jakarta.persistence.*;

@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String section;
    
    @Column(name = "row")
    private String row;
    
    @Column(name = "seat_column")
    private int column;
    
    private boolean booked;
    
    @Column(name = "student_name")
    private String studentName;
    
    @Column(name = "student_id")
    private String studentId;
    
    private String faculty;

    public Seat() {}

    public Seat(String section, String row, int column) {
        this.section = section;
        this.row = row;
        this.column = column;
        this.booked = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    
    public String getRow() { return row; }
    public void setRow(String row) { this.row = row; }
    
    public int getColumn() { return column; }
    public void setColumn(int column) { this.column = column; }
    
    public boolean isBooked() { return booked; }
    public void setBooked(boolean booked) { this.booked = booked; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    
    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }
} 