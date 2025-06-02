package com.sistema.repository;

import com.sistema.modelo.Curso;
import com.sistema.modelo.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    
    // Buscar cursos por estudiante matriculado
    @Query("SELECT c FROM Curso c JOIN c.estudiantes e WHERE e.id = :estudianteId")
    List<Curso> findCursosByEstudianteId(@Param("estudianteId") Long estudianteId);
    
    // Buscar cursos disponibles (que el estudiante NO tiene matriculados)
    @Query("SELECT c FROM Curso c WHERE c.id NOT IN " +
           "(SELECT curso.id FROM Curso curso JOIN curso.estudiantes e WHERE e.id = :estudianteId)")
    List<Curso> findCursosDisponiblesParaEstudiante(@Param("estudianteId") Long estudianteId);
    
    // Buscar cursos por nombre
    List<Curso> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar cursos por profesor
    @Query("SELECT c FROM Curso c WHERE c.profesor.id = :profesorId")
    List<Curso> findByProfesorId(@Param("profesorId") Long profesorId);
    
    // Buscar cursos por horario específico
    List<Curso> findByHorarioContainingIgnoreCase(String horario);
    
    // Verificar si estudiante está matriculado en curso
    @Query("SELECT COUNT(e) > 0 FROM Curso c JOIN c.estudiantes e WHERE c.id = :cursoId AND e.id = :estudianteId")
    boolean existeMatriculaEstudianteCurso(@Param("cursoId") Long cursoId, @Param("estudianteId") Long estudianteId);
}
