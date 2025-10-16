package com.sistema.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "distribuidora")
public class Distribuidora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Distribuidora")
    private Long idDistribuidora;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String direccion;

    private String url;

    private String telefono;

    private String email;

    @JsonIgnore
    @OneToMany(mappedBy = "distribuidora", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Pelicula> peliculas = new ArrayList<>();

    // Constructor vacío
    public Distribuidora() {
        this.peliculas = new ArrayList<>();
    }

    // Constructor completo
    public Distribuidora(String nombre, String direccion, String url, String telefono, String email) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.url = url;
        this.telefono = telefono;
        this.email = email;
        this.peliculas = new ArrayList<>();
    }

    // Getters y Setters

    public Long getIdDistribuidora() {
        return idDistribuidora;
    }

    public void setIdDistribuidora(Long idDistribuidora) {
        this.idDistribuidora = idDistribuidora;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Pelicula> getPeliculas() {
        return peliculas;
    }

    public void setPeliculas(List<Pelicula> peliculas) {
        this.peliculas = peliculas;
    }

    @Override
    public String toString() {
        return "Distribuidora{" +
                "idDistribuidora=" + idDistribuidora +
                ", nombre='" + nombre + '\'' +
                (direccion != null ? ", direccion='" + direccion + '\'' : "") +
                (url != null ? ", url='" + url + '\'' : "") +
                (telefono != null ? ", telefono='" + telefono + '\'' : "") +
                (email != null ? ", email='" + email + '\'' : "") +
                '}';
    }
}
