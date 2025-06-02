package com.sistema.repository;

import com.sistema.modelo.Nota;
import com.sistema.modelo.Estudiante;
import com.sistema.modelo.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByEstudiante(Estudiante estudiante);

    List<Nota> findByCurso(Curso curso);

    Nota findByEstudianteAndCurso(Estudiante estudiante, Curso curso);
    
    // Nuevo: Buscar notas por ID de estudiante
    @Query("SELECT n FROM Nota n WHERE n.estudiante.id = :estudianteId ORDER BY n.fechaRegistro DESC")
    List<Nota> findByEstudianteId(@Param("estudianteId") Long estudianteId);
    
    // Nuevo: Buscar notas por estudiante y curso
    @Query("SELECT n FROM Nota n WHERE n.estudiante.id = :estudianteId AND n.curso.id = :cursoId ORDER BY n.fechaRegistro DESC")
    List<Nota> findByEstudianteIdAndCursoId(@Param("estudianteId") Long estudianteId, @Param("cursoId") Long cursoId);
    
    // Nuevo: Calcular promedio por estudiante
    @Query("SELECT AVG(n.calificacion) FROM Nota n WHERE n.estudiante.id = :estudianteId")
    Double calcularPromedioByEstudianteId(@Param("estudianteId") Long estudianteId);
}
