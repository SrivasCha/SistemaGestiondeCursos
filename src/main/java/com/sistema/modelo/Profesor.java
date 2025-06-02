package com.sistema.modelo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "profesores")
public class Profesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String especialidad;
    private String email;

    @OneToMany(mappedBy = "profesor")
    private List<Curso> cursos;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Constructor vacío
    public Profesor() {
    }

    // Constructor completo
    public Profesor(Long id, String nombre, String especialidad, String email, List<Curso> cursos, Usuario usuario) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.especialidad = especialidad;
        this.email = email;
        this.cursos = cursos;
        this.usuario = usuario;
    }

    // Constructor personalizado (sin el campo 'id' y 'cursos')
    public Profesor(String nombre, String especialidad, String email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.especialidad = especialidad;
        this.email = email;
    }

    // Getters y Setters explícitos

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

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(List<Curso> cursos) {
        this.cursos = cursos;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    // Método para obtener el nombre completo (ajusta según tu modelo)
    public String getNombreCompleto() {
        return this.nombre;
    }

    @Override
    public String toString() {
        return "Profesor{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", especialidad='" + especialidad + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}