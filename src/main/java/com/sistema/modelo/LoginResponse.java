package com.sistema.modelo;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;

public class LoginResponse {
    private String token;
    private String rol;

    public LoginResponse() {}

    public LoginResponse(String token, String rol) {
        this.token = token;
        this.rol = rol;
    }

    // getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}