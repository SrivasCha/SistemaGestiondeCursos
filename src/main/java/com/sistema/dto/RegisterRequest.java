package com.sistema.dto;

import java.time.LocalDate;
import java.util.List;

public class RegisterRequest {
    private String nombre;
    private String apellido; // Nuevo campo
    private String email;
    private String password;
    private String rol; // "ESTUDIANTE", "PROFESOR", "ADMIN"

    // Campos específicos para ESTUDIANTE
    private String numeroIdentificacion;
    private String direccion;
    private String telefono;
    private LocalDate fechaNacimiento; // Se espera formato YYYY-MM-DD del frontend
    private String fotoPerfil;

    // Campos específicos para PROFESOR
    private String especialidad;
    private List<Long> cursosIds; // Lista de IDs de cursos para asignar al profesor

    // Constructor vacío (necesario para Jackson)
    public RegisterRequest() {
    }

    // Getters y Setters para todos los campos (esencial para la deserialización JSON)
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNumeroIdentificacion() {
        return numeroIdentificacion;
    }

    public void setNumeroIdentificacion(String numeroIdentificacion) {
        this.numeroIdentificacion = numeroIdentificacion;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public List<Long> getCursosIds() {
        return cursosIds;
    }

    public void setCursosIds(List<Long> cursosIds) {
        this.cursosIds = cursosIds;
    }
}