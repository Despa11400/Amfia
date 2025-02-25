package com.theater;

import com.theater.config.SupabaseConfig;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class TestConnection {
    public static void main(String[] args) {
        String url = String.format("jdbc:postgresql://%s:%s/%s",
            SupabaseConfig.DB_HOST,
            SupabaseConfig.DB_PORT,
            SupabaseConfig.DB_NAME);
            
        Properties props = new Properties();
        props.setProperty("user", SupabaseConfig.DB_USER);
        props.setProperty("password", SupabaseConfig.DB_PASSWORD);
        props.setProperty("sslmode", "require");
        props.setProperty("ssl", "true");
        props.setProperty("sslfactory", "org.postgresql.ssl.NonValidatingFactory");

        try {
            System.out.println("Testing connection to: " + url);
            Connection conn = DriverManager.getConnection(url, props);
            System.out.println("Connection successful!");
            conn.close();
        } catch (Exception e) {
            System.out.println("Connection failed!");
            e.printStackTrace();
        }
    }
}