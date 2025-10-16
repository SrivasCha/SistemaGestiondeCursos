package com.sistema.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "copia")
public class Copia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Copia")
    private Long idCopia;

    @Column(name = "codigo_inventario", nullable = false, unique = true) 
    private String codigoInventario;

    @Column(name = "Numero_Registro", nullable = false, unique = true)
    private String numeroRegistro;

    @Column(name = "Formato", nullable = false)
    private String formato;

    @Column(name = "Disponible", nullable = false)
    private Boolean disponible = true;

    @Column(name = "estado")
    private String estado = "Disponible"; // Disponible o Alquilada

    @JsonIgnoreProperties({"copias", "handler", "hibernateLazyInitializer"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_Pelicula", nullable = false)
    private Pelicula pelicula;

    @JsonIgnore
    @OneToMany(mappedBy = "copia", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Alquiler> alquileres = new ArrayList<>();

    public Copia() {
        this.alquileres = new ArrayList<>();
        this.disponible = true;
        this.estado = "Disponible";
    }

    public Copia(String codigoInventario, String numeroRegistro, String formato, Boolean disponible, Pelicula pelicula) {
        this.codigoInventario = codigoInventario;
        this.numeroRegistro = numeroRegistro;
        this.formato = formato;
        this.disponible = disponible != null ? disponible : true;
        this.pelicula = pelicula;
        this.alquileres = new ArrayList<>();
        this.estado = this.disponible ? "Disponible" : "Alquilada";
    }

    // Getters y Setters
    public Long getIdCopia() {
        return idCopia;
    }

    public void setIdCopia(Long idCopia) {
        this.idCopia = idCopia;
    }

    @Transient
    public Long getId() {
        return idCopia;
    }
    
    @Transient
    public void setId(Long id) {
        this.idCopia = id;
    }
    
    public String getCodigoInventario() {
        return codigoInventario;
    }

    public void setCodigoInventario(String codigoInventario) {
        this.codigoInventario = codigoInventario;
    }
    
    public String getNumeroRegistro() {
        return numeroRegistro;
    }

    public void setNumeroRegistro(String numeroRegistro) {
        this.numeroRegistro = numeroRegistro;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
        this.estado = disponible ? "Disponible" : "Alquilada";
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
        this.disponible = "Disponible".equals(estado);
    }

    public Pelicula getPelicula() {
        return pelicula;
    }

    public void setPelicula(Pelicula pelicula) {
        this.pelicula = pelicula;
    }

    public List<Alquiler> getAlquileres() {
        return alquileres;
    }

    public void setAlquileres(List<Alquiler> alquileres) {
        this.alquileres = alquileres;
    }

    @Override
    public String toString() {
        return "Copia{" +
                "idCopia=" + idCopia +
                ", codigoInventario='" + codigoInventario + '\'' +
                ", numeroRegistro='" + numeroRegistro + '\'' +
                ", formato='" + formato + '\'' +
                ", disponible=" + disponible +
                ", estado='" + estado + '\'' +
                (pelicula != null ? ", peliculaId=" + pelicula.getIdPelicula() : "") +
                '}';
    }
}