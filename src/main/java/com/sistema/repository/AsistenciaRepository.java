package com.sistema.repository;

import com.sistema.modelo.Asistencia;
import com.sistema.modelo.Curso;
import com.sistema.modelo.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    /**
     * Busca un registro de asistencia por estudiante, curso y fecha.
     * @param estudiante El estudiante.
     * @param curso El curso.
     * @param fecha La fecha de la asistencia.
     * @return El registro de asistencia si existe, o null.
     */
    Asistencia findByEstudianteAndCursoAndFecha(Estudiante estudiante, Curso curso, LocalDate fecha);

    /**
     * Busca todos los registros de asistencia para un curso y fecha específicos.
     * @param curso El curso.
     * @param fecha La fecha de la asistencia.
     * @return Una lista de registros de asistencia.
     */
    List<Asistencia> findByCursoAndFecha(Curso curso, LocalDate fecha);
}