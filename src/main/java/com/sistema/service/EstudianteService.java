package com.sistema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistema.modelo.*;
import com.sistema.repository.*;

import java.util.List;
import java.util.Set;
import java.util.Optional;

@Service
@Transactional
public class EstudianteService {
    
    @Autowired
    private EstudianteRepository estudianteRepo;
    
    @Autowired
    private CursoRepository cursoRepo;
    
    @Autowired
    private NotaRepository notaRepo;
    
    public List<Estudiante> listar() {
        return estudianteRepo.findAll();
    }
    
    public Estudiante guardar(Estudiante estudiante) {
        return estudianteRepo.save(estudiante);
    }
    
    public void eliminar(Long id) {
        estudianteRepo.deleteById(id);
    }
    
    public Estudiante obtenerPorId(Long id) {
        return estudianteRepo.findById(id).orElse(null);
    }
    
    // Nuevo: Obtener estudiante por usuario
    public Optional<Estudiante> obtenerPorUsuario(Usuario usuario) {
        return estudianteRepo.findByUsuario(usuario);
    }
    
    // Nuevo: Obtener cursos del estudiante
    public Set<Curso> obtenerCursosDelEstudiante(Long estudianteId) {
        Estudiante estudiante = obtenerPorId(estudianteId);
        return estudiante != null ? estudiante.getCursos() : Set.of();
    }
    
    // Nuevo: Matricular estudiante en curso
    public boolean matricularEnCurso(Long estudianteId, Long cursoId) {
        try {
            Optional<Estudiante> estudianteOpt = estudianteRepo.findById(estudianteId);
            Optional<Curso> cursoOpt = cursoRepo.findById(cursoId);
            
            if (estudianteOpt.isPresent() && cursoOpt.isPresent()) {
                Estudiante estudiante = estudianteOpt.get();
                Curso curso = cursoOpt.get();
                
                // Verificar si ya está matriculado
                if (!estudiante.getCursos().contains(curso)) {
                    estudiante.getCursos().add(curso);
                    estudianteRepo.save(estudiante);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Nuevo: Desmatricular estudiante de curso
    public boolean desmatricularDeCurso(Long estudianteId, Long cursoId) {
        try {
            Optional<Estudiante> estudianteOpt = estudianteRepo.findById(estudianteId);
            Optional<Curso> cursoOpt = cursoRepo.findById(cursoId);
            
            if (estudianteOpt.isPresent() && cursoOpt.isPresent()) {
                Estudiante estudiante = estudianteOpt.get();
                Curso curso = cursoOpt.get();
                
                if (estudiante.getCursos().contains(curso)) {
                    estudiante.getCursos().remove(curso);
                    estudianteRepo.save(estudiante);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Nuevo: Obtener cursos disponibles para matricularse
    public List<Curso> obtenerCursosDisponibles(Long estudianteId) {
        return cursoRepo.findCursosDisponiblesParaEstudiante(estudianteId);
    }
    
    // Nuevo: Calcular promedio de notas del estudiante
    public Double calcularPromedioNotas(Long estudianteId) {
        List<Nota> notas = notaRepo.findByEstudianteId(estudianteId);
        if (notas.isEmpty()) {
            return 0.0;
        }
        
        double suma = notas.stream()
                .mapToDouble(Nota::getCalificacion)
                .sum();
        
        return suma / notas.size();
    }
    
    // Nuevo: Actualizar foto de perfil
    public boolean actualizarFotoPerfil(Long estudianteId, String urlFoto) {
        try {
            Optional<Estudiante> estudianteOpt = estudianteRepo.findById(estudianteId);
            if (estudianteOpt.isPresent()) {
                Estudiante estudiante = estudianteOpt.get();
                estudiante.setFotoPerfil(urlFoto);
                estudianteRepo.save(estudiante);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
