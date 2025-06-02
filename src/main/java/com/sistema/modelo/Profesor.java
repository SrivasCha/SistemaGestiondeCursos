package com.sistema.modelo;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "profesores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Profesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String especialidad;
    private String email;

    @OneToMany(mappedBy = "profesor")
    private List<Curso> cursos;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    // Constructor personalizado (sin el campo 'id' y 'cursos')
    public Profesor(String nombre, String especialidad, String email) {
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.email = email;
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