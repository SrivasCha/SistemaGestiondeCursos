package com.sistema.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "tarifa")
public class Tarifa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarifa")
    private Long idTarifa;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    // Campo existente: Días sin penalización
    @JsonProperty("dias_prestamo") 
    @Column(name = "dias_prestamo", nullable = false)
    private Integer diasPrestamo; 

    // 👈 ¡CORRECCIÓN CLAVE! Campo para la penalización diaria
    @JsonProperty("penalizacion_diaria")
    @Column(name = "penalizacion_diaria", nullable = false, precision = 10, scale = 2)
    private BigDecimal penalizacionDiaria;

    @JsonIgnore
    @OneToMany(mappedBy = "tarifa", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Pelicula> peliculas = new ArrayList<>();

    // Constructor vacío
    public Tarifa() {
        this.peliculas = new ArrayList<>();
    }

    // Constructor completo (Actualizado con penalizacionDiaria)
    public Tarifa(String tipo, BigDecimal precio, Integer diasPrestamo, BigDecimal penalizacionDiaria) {
        this.tipo = tipo;
        this.precio = precio;
        this.diasPrestamo = diasPrestamo;
        this.penalizacionDiaria = penalizacionDiaria;
        this.peliculas = new ArrayList<>();
    }

    // --- Getters y Setters ---
    
    public Long getIdTarifa() {
        return idTarifa;
    }

    public void setIdTarifa(Long idTarifa) {
        this.idTarifa = idTarifa;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getDiasPrestamo() {
        return diasPrestamo;
    }

    public void setDiasPrestamo(Integer diasPrestamo) {
        this.diasPrestamo = diasPrestamo;
    }

    // 👈 Getter y Setter para la penalización diaria
    public BigDecimal getPenalizacionDiaria() {
        return penalizacionDiaria;
    }

    public void setPenalizacionDiaria(BigDecimal penalizacionDiaria) {
        this.penalizacionDiaria = penalizacionDiaria;
    }

    public List<Pelicula> getPeliculas() {
        return peliculas;
    }

    public void setPeliculas(List<Pelicula> peliculas) {
        this.peliculas = peliculas;
    }

    @Override
    public String toString() {
        return "Tarifa{" +
                "idTarifa=" + idTarifa +
                ", tipo='" + tipo + '\'' +
                ", precio=" + precio +
                ", diasPrestamo=" + diasPrestamo + 
                ", penalizacionDiaria=" + penalizacionDiaria + // 👈 Actualizado
                '}';
    }
}