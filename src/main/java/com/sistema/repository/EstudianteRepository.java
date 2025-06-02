package com.sistema.repository;

import com.sistema.modelo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    // Método para buscar por entidad Usuario
    Optional<Estudiante> findByUsuario(Usuario usuario);
    
    // Buscar estudiante por email
    Optional<Estudiante> findByEmail(String email);
    
    // Buscar estudiantes por curso
    @Query("SELECT e FROM Estudiante e JOIN e.cursos c WHERE c.id = :cursoId")
    List<Estudiante> findEstudiantesByCursoId(@Param("cursoId") Long cursoId);
    
    // Verificar si estudiante está matriculado en curso
    @Query("SELECT COUNT(e) > 0 FROM Estudiante e JOIN e.cursos c WHERE e.id = :estudianteId AND c.id = :cursoId")
    boolean existsMatriculaEstudianteCurso(@Param("estudianteId") Long estudianteId, @Param("cursoId") Long cursoId);
}
