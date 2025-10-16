package com.sistema.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "empleado")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String email;

    // ✅ CAMPO AÑADIDO: Mapea a la columna 'telefono' en la BD
    private String telefono; 

    @Column(name = "numero_identificacion", unique = true)
    private String numeroIdentificacion;

    private String cargo; // Ejemplo: "Gerente", "Dependiente", etc.

    @Column(name = "fecha_contratacion")
    private LocalDate fechaContratacion;

    @JsonIgnore
    @OneToMany(mappedBy = "empleado", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Alquiler> alquileresRegistrados = new ArrayList<>();


    // ===========================
    // Constructores
    // ===========================

    // Constructor vacío
    public Empleado() {
        this.alquileresRegistrados = new ArrayList<>();
    }

    // Constructor básico para creación (ACTUALIZADO para incluir teléfono)
    public Empleado(String nombre, String apellido, String email, String telefono, String numeroIdentificacion, String cargo) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.numeroIdentificacion = numeroIdentificacion;
        this.cargo = cargo;
        this.fechaContratacion = LocalDate.now();
        this.alquileresRegistrados = new ArrayList<>();
    }

    // ===========================
    // Getters y Setters
    // ===========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    // ✅ GETTER y SETTER para telefono
    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getNumeroIdentificacion() {
        return numeroIdentificacion;
    }

    public void setNumeroIdentificacion(String numeroIdentificacion) {
        this.numeroIdentificacion = numeroIdentificacion;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }

    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }

    public List<Alquiler> getAlquileresRegistrados() {
        return alquileresRegistrados;
    }

    public void setAlquileresRegistrados(List<Alquiler> alquileresRegistrados) {
        this.alquileresRegistrados = alquileresRegistrados;
    }

    // ===========================
    // toString()
    // ===========================
    @Override
    public String toString() {
        return "Empleado{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", cargo='" + cargo + '\'' +
                '}';
    }
}