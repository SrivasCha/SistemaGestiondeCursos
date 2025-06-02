package com.sistema.repository;

import com.sistema.modelo.Nota;
import com.sistema.modelo.Estudiante;
import com.sistema.modelo.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByEstudiante(Estudiante estudiante);

    List<Nota> findByCurso(Curso curso);

    Nota findByEstudianteAndCurso(Estudiante estudiante, Curso curso);
}
