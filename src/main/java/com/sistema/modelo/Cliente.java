package com.sistema.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // CORRECCIÓN: Usar @Column para mapear 'id' del objeto a 'id_cliente' de la tabla
    @Column(name = "id_cliente") 
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "numero_identificacion", unique = true)
    private String numeroIdentificacion;

    private String direccion;

    private String telefono;

    // Se recomienda usar @Column para campos que no siguen el snake_case 
    // y para los que no tienen una correspondencia directa, aunque 
    // LocalDate generalmente se mapea bien. Por simplicidad, se deja así 
    // asumiendo que el nombre de la columna en la BD es 'fechaNacimiento'
    private LocalDate fechaNacimiento; 

    // Asumiendo que el nombre de la columna en la BD es 'fotoPerfil'
    private String fotoPerfil; 

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Alquiler> alquileres = new ArrayList<>();

    // ... (El resto de tu código, constructores y getters/setters, permanece igual)

    // Constructor vacío
    public Cliente() {
        this.alquileres = new ArrayList<>();
    }

    // Constructor básico para POST/creación rápida
    public Cliente(String nombre, String apellido, String email, String numeroIdentificacion) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.numeroIdentificacion = numeroIdentificacion;
        this.alquileres = new ArrayList<>();
    }

    // Getters y Setters

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

    public List<Alquiler> getAlquileres() {
        return alquileres;
    }

    public void setAlquileres(List<Alquiler> alquileres) {
        this.alquileres = alquileres;
    }

    // Método auxiliar: nombre completo
    public String getNombreCompleto() {
        return (this.nombre != null ? this.nombre : "") + " " + (this.apellido != null ? this.apellido : "");
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", email='" + email + '\'' +
                (numeroIdentificacion != null ? ", numeroIdentificacion='" + numeroIdentificacion + '\'' : "") +
                '}';
    }
}