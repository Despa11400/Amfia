package com.theater.config;

public class SupabaseConfig {
    // Connection pooling parameters from Supabase Dashboard
    public static final String DB_HOST = "aws-0-eu-central-1.pooler.supabase.com";  // Updated pooler URL
    public static final String DB_PORT = "5432"; 
    public static final String DB_NAME = "postgres";
    public static final String DB_USER = "postgres.nlkdtixbltzvhtxhzvhi";  // Add project reference
    public static final String DB_PASSWORD = "Zekapeka111";
    public static final String ADMIN_PASSWORD = "Zekapeka111";  // Using the same password as DB for simplicity

    static {
        System.out.println("\nDatabase configuration:");
        System.out.println("Host: " + DB_HOST);
        System.out.println("Port: " + DB_PORT);
        System.out.println("Database: " + DB_NAME);
        System.out.println("User: " + DB_USER + "\n");
    }
} 