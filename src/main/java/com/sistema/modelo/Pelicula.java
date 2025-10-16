package com.sistema.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pelicula")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Evita el error 500 al serializar
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pelicula")
    private Long idPelicula;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private Integer anio;

    private String director;

    @Lob
    private String reparto;

    private String genero;

    private String clasificacion;

    @Column(name = "portada_url")
    private String portadaUrl;

    // Evita bucles y el error de serialización
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_distribuidora")
    @JsonIgnoreProperties({"peliculas", "hibernateLazyInitializer", "handler"})
    private Distribuidora distribuidora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tarifa")
    @JsonIgnoreProperties({"peliculas", "hibernateLazyInitializer", "handler"})
    private Tarifa tarifa;

    @JsonIgnore // Evita ciclos infinitos y exceso de datos
    @OneToMany(mappedBy = "pelicula", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Copia> copias = new ArrayList<>();

    // ===========================
    // Constructores
    // ===========================
    public Pelicula() {
        this.copias = new ArrayList<>();
    }

    public Pelicula(String titulo, Integer anio, String director, String genero, String clasificacion) {
        this.titulo = titulo;
        this.anio = anio;
        this.director = director;
        this.genero = genero;
        this.clasificacion = clasificacion;
        this.copias = new ArrayList<>();
    }

    public Pelicula(String titulo, Integer anio, String director, String reparto,
                    String genero, String clasificacion, String portadaUrl,
                    Distribuidora distribuidora, Tarifa tarifa) {
        this.titulo = titulo;
        this.anio = anio;
        this.director = director;
        this.reparto = reparto;
        this.genero = genero;
        this.clasificacion = clasificacion;
        this.portadaUrl = portadaUrl;
        this.distribuidora = distribuidora;
        this.tarifa = tarifa;
        this.copias = new ArrayList<>();
    }

    // ===========================
    // Getters y Setters
    // ===========================

    // ✅ CORRECCIÓN CLAVE 1: Agregamos un getter genérico 'getId()' para que Jackson
    // reconozca la propiedad 'id' del JSON.
    @Transient // No se mapea a una columna extra
    public Long getId() {
        return this.idPelicula;
    }

    // ✅ CORRECCIÓN CLAVE 2: Agregamos un setter genérico 'setId()' para que Jackson
    // pueda asignar el valor '1' del JSON a la propiedad 'idPelicula'.
    @Transient
    public void setId(Long id) {
        this.idPelicula = id;
    }
    
    public Long getIdPelicula() {
        return idPelicula;
    }

    public void setIdPelicula(Long idPelicula) {
        this.idPelicula = idPelicula;
    }

    // ... (El resto de getters y setters permanece sin cambios)

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getReparto() {
        return reparto;
    }

    public void setReparto(String reparto) {
        this.reparto = reparto;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getClasificacion() {
        return clasificacion;
    }

    public void setClasificacion(String clasificacion) {
        this.clasificacion = clasificacion;
    }

    public String getPortadaUrl() {
        return portadaUrl;
    }

    public void setPortadaUrl(String portadaUrl) {
        this.portadaUrl = portadaUrl;
    }

    public Distribuidora getDistribuidora() {
        return distribuidora;
    }

    public void setDistribuidora(Distribuidora distribuidora) {
        this.distribuidora = distribuidora;
    }

    public Tarifa getTarifa() {
        return tarifa;
    }

    public void setTarifa(Tarifa tarifa) {
        this.tarifa = tarifa;
    }

    public List<Copia> getCopias() {
        return copias;
    }

    public void setCopias(List<Copia> copias) {
        this.copias = copias;
    }

    // ===========================
    // toString()
    // ===========================
    @Override
    public String toString() {
        return "Pelicula{" +
                "idPelicula=" + idPelicula +
                ", titulo='" + titulo + '\'' +
                ", anio=" + anio +
                (director != null ? ", director='" + director + '\'' : "") +
                (genero != null ? ", genero='" + genero + '\'' : "") +
                (clasificacion != null ? ", clasificacion='" + clasificacion + '\'' : "") +
                (tarifa != null ? ", tarifaId=" + tarifa.getIdTarifa() : "") +
                (distribuidora != null ? ", distribuidoraId=" + distribuidora.getIdDistribuidora() : "") +
                '}';
    }
}