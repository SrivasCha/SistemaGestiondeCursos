package com.sistema.service;

import com.sistema.modelo.Asistencia;
import com.sistema.modelo.Curso;
import com.sistema.modelo.Estudiante;
import com.sistema.repository.AsistenciaRepository; // Importa el repositorio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    public List<Asistencia> listarTodasLasAsistencias() {
        return asistenciaRepository.findAll();
    }

    public Asistencia guardarAsistencia(Asistencia asistencia) {
        return asistenciaRepository.save(asistencia);
    }

    public void eliminarAsistencia(Long id) {
        asistenciaRepository.deleteById(id);
    }

    /**
     * Busca un registro de asistencia para un estudiante, curso y fecha específicos.
     * @param estudiante El estudiante.
     * @param curso El curso.
     * @param fecha La fecha de la asistencia.
     * @return El objeto Asistencia si existe, o null.
     */
    public Asistencia findByEstudianteAndCursoAndFecha(Estudiante estudiante, Curso curso, LocalDate fecha) {
        return asistenciaRepository.findByEstudianteAndCursoAndFecha(estudiante, curso, fecha);
    }

    /**
     * Busca todos los registros de asistencia para un curso y fecha específicos.
     * @param curso El curso.
     * @param fecha La fecha de la asistencia.
     * @return Una lista de registros de asistencia.
     */
    public List<Asistencia> findByCursoAndFecha(Curso curso, LocalDate fecha) {
        return asistenciaRepository.findByCursoAndFecha(curso, fecha);
    }

    public Optional<Asistencia> findById(Long id) {
        return asistenciaRepository.findById(id);
    }
}