package com.sistema.modelo;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;

public class LoginRequest {
    private String email;
    private String password;

    // Add constructors, getters, and setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}