package com.sistema.controller;

import com.sistema.modelo.*;
import com.sistema.service.*;
import com.sistema.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "http://localhost:5173")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;
    
    @Autowired
    private CursoService cursoService;
    
    @Autowired
    private NotaService notaService;
    
    @Autowired
    private UsuarioRepository usuarioRepo;
    
    @Autowired
    private EstudianteRepository estudianteRepo;

    // Obtener información del estudiante actual
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/perfil")
    public ResponseEntity<Estudiante> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            return ResponseEntity.ok(estudiante);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar perfil del estudiante
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @PutMapping("/perfil")
    public ResponseEntity<Estudiante> actualizarPerfil(
            @RequestBody Estudiante estudianteActualizado,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            // Actualizar solo los campos permitidos
            estudiante.setNombre(estudianteActualizado.getNombre());
            estudiante.setApellido(estudianteActualizado.getApellido());
            estudiante.setDireccion(estudianteActualizado.getDireccion());
            estudiante.setTelefono(estudianteActualizado.getTelefono());
            estudiante.setFotoPerfil(estudianteActualizado.getFotoPerfil());
            
            Estudiante estudianteGuardado = estudianteService.guardar(estudiante);
            return ResponseEntity.ok(estudianteGuardado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener cursos matriculados del estudiante
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/mis-cursos")
    public ResponseEntity<List<Map<String, Object>>> obtenerMisCursos(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            List<Map<String, Object>> cursosInfo = estudiante.getCursos().stream()
                .map(curso -> {
                    Map<String, Object> cursoInfo = new HashMap<>();
                    cursoInfo.put("id", curso.getId());
                    cursoInfo.put("nombre", curso.getNombre());
                    cursoInfo.put("duracion", curso.getDuracion());
                    cursoInfo.put("horario", curso.getHorario());
                    cursoInfo.put("profesor", curso.getProfesor() != null ? curso.getProfesor().getNombre() : "Sin asignar");
                    return cursoInfo;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(cursosInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener cursos disponibles para matricularse
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/cursos-disponibles")
    public ResponseEntity<List<Curso>> obtenerCursosDisponibles(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            List<Curso> cursosDisponibles = estudianteService.obtenerCursosDisponibles(estudiante.getId());
            return ResponseEntity.ok(cursosDisponibles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Matricularse en un curso
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @PostMapping("/matricular/{cursoId}")
    public ResponseEntity<Map<String, String>> matricularEnCurso(
            @PathVariable Long cursoId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            boolean matriculado = estudianteService.matricularEnCurso(estudiante.getId(), cursoId);
            
            Map<String, String> response = new HashMap<>();
            if (matriculado) {
                response.put("mensaje", "Te has matriculado exitosamente en el curso");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                response.put("mensaje", "No se pudo matricular en el curso");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Error interno del servidor");
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Desmatricularse de un curso
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @DeleteMapping("/desmatricular/{cursoId}")
    public ResponseEntity<Map<String, String>> desmatricularDeCurso(
            @PathVariable Long cursoId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            boolean desmatriculado = estudianteService.desmatricularDeCurso(estudiante.getId(), cursoId);
            
            Map<String, String> response = new HashMap<>();
            if (desmatriculado) {
                response.put("mensaje", "Te has desmatriculado exitosamente del curso");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                response.put("mensaje", "No se pudo desmatricular del curso");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Error interno del servidor");
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Obtener calificaciones del estudiante
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/mis-notas")
    public ResponseEntity<List<Map<String, Object>>> obtenerMisNotas(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            List<Nota> notas = notaService.buscarPorEstudiante(estudiante);
            
            List<Map<String, Object>> notasInfo = notas.stream()
                .map(nota -> {
                    Map<String, Object> notaInfo = new HashMap<>();
                    notaInfo.put("id", nota.getId());
                    notaInfo.put("calificacion", nota.getCalificacion());
                    notaInfo.put("tipo", nota.getTipo());
                    notaInfo.put("descripcion", nota.getDescripcion());
                    notaInfo.put("fechaRegistro", nota.getFechaRegistro());
                    notaInfo.put("curso", nota.getCurso().getNombre());
                    notaInfo.put("cursoId", nota.getCurso().getId());
                    return notaInfo;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(notasInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener promedio de notas
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/promedio")
    public ResponseEntity<Map<String, Object>> obtenerPromedio(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            Double promedio = estudianteService.calcularPromedioNotas(estudiante.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("promedio", promedio);
            response.put("estudianteId", estudiante.getId());
            response.put("estudiante", estudiante.getNombreCompleto());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener estadísticas del estudiante
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            int totalCursos = estudiante.getCursos().size();
            List<Nota> notas = notaService.buscarPorEstudiante(estudiante);
            int totalNotas = notas.size();
            Double promedio = estudianteService.calcularPromedioNotas(estudiante.getId());
            
            Map<String, Object> estadisticas = new HashMap<>();
            estadisticas.put("totalCursos", totalCursos);
            estadisticas.put("totalNotas", totalNotas);
            estadisticas.put("promedio", promedio);
            estadisticas.put("estudianteNombre", estudiante.getNombreCompleto());
            
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
