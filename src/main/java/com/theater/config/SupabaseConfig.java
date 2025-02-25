package com.theater.config;

import org.springframework.stereotype.Component;

@Component
public class SupabaseConfig {
    // Connection pooling parameters from Supabase Dashboard
    public static final String DB_HOST = "aws-0-eu-central-1.pooler.supabase.com";  // Updated pooler URL
    public static final String DB_PORT = "5432"; 
    public static final String DB_NAME = "postgres";
    public static final String DB_USER = "postgres.nlkdtixbltzvhtxhzvhi";  // Add project reference
    public static final String DB_PASSWORD = "Zekapeka111";
    public static final String ADMIN_PASSWORD = "Zekapeka111";  // Make sure this matches what you're using

    static {
        System.out.println("\nDatabase configuration:");
        System.out.println("Host: " + DB_HOST);
        System.out.println("Port: " + DB_PORT);
        System.out.println("Database: " + DB_NAME);
        System.out.println("User: " + DB_USER + "\n");
    }

    // Getters
    public String getDbHost() {
        return DB_HOST;
    }

    public String getDbPort() {
        return DB_PORT;
    }

    public String getDbName() {
        return DB_NAME;
    }

    public String getDbUser() {
        return DB_USER;
    }

    public String getDbPassword() {
        return DB_PASSWORD;
    }
} 