package com.sistema.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private boolean presente;

    // Constructor vacío (necesario para JPA)
    public Asistencia() {
    }

    // Constructor completo (opcional, pero útil)
    public Asistencia(Long id, Estudiante estudiante, Curso curso, LocalDate fecha, boolean presente) {
        this.id = id;
        this.estudiante = estudiante;
        this.curso = curso;
        this.fecha = fecha;
        this.presente = presente;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public Curso getCurso() {
        return curso;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public boolean isPresente() {
        return presente;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setPresente(boolean presente) {
        this.presente = presente;
    }

    // Puedes añadir otros campos si son necesarios, como 'observaciones'
}