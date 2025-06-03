package com.sistema.controller;

import com.sistema.modelo.*;
import com.sistema.service.*;
import com.sistema.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/estudiante")
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
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            // Crear mapa con la información del estudiante
            Map<String, Object> perfilInfo = new HashMap<>();
            perfilInfo.put("id", estudiante.getId());
            perfilInfo.put("nombre", estudiante.getNombre());
            perfilInfo.put("apellido", estudiante.getApellido());
            perfilInfo.put("direccion", estudiante.getDireccion());
            perfilInfo.put("telefono", estudiante.getTelefono());
            perfilInfo.put("fotoPerfil", estudiante.getFotoPerfil());
            perfilInfo.put("fechaNacimiento", estudiante.getFechaNacimiento());
            perfilInfo.put("numeroIdentificacion", estudiante.getNumeroIdentificacion());
            perfilInfo.put("email", usuario.getEmail());
            
            return ResponseEntity.ok(perfilInfo);
        } catch (Exception e) {
            System.err.println("Error al obtener perfil: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar perfil del estudiante
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
    @PutMapping(value = "/perfil", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> actualizarPerfil(
            @RequestParam("nombre") String nombre,
            @RequestParam("apellido") String apellido,
            @RequestParam("direccion") String direccion,
            @RequestParam("telefono") String telefono,
            @RequestParam(value = "fotoPerfil", required = false) MultipartFile fotoPerfil,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            // Actualizar datos personales
            estudiante.setNombre(nombre);
            estudiante.setApellido(apellido);
            estudiante.setDireccion(direccion);
            estudiante.setTelefono(telefono);

            // Guardar imagen si se envía
            if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
                String nombreArchivo = UUID.randomUUID() + "_" + fotoPerfil.getOriginalFilename();
                Path rutaDestino = Paths.get("uploads").resolve(nombreArchivo).normalize();
                try {
                    Files.createDirectories(rutaDestino.getParent());
                    Files.copy(fotoPerfil.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);
                    estudiante.setFotoPerfil(nombreArchivo); // Guardar solo el nombre en DB
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "Error al guardar la imagen"));
                }
            }

            Estudiante estudianteGuardado = estudianteService.guardar(estudiante);

            // Respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("id", estudianteGuardado.getId());
            response.put("nombre", estudianteGuardado.getNombre());
            response.put("apellido", estudianteGuardado.getApellido());
            response.put("direccion", estudianteGuardado.getDireccion());
            response.put("telefono", estudianteGuardado.getTelefono());
            response.put("fotoPerfil", estudianteGuardado.getFotoPerfil());
            response.put("mensaje", "Perfil actualizado correctamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Obtener cursos matriculados del estudiante
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
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
                    cursoInfo.put("descripcion", curso.getDescripcion());
                    if (curso.getProfesor() != null) {
                        cursoInfo.put("profesor", curso.getProfesor().getNombreCompleto());
                        cursoInfo.put("profesorId", curso.getProfesor().getId());
                    } else {
                        cursoInfo.put("profesor", "Sin asignar");
                        cursoInfo.put("profesorId", null);
                    }
                    return cursoInfo;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(cursosInfo);
        } catch (Exception e) {
            System.err.println("Error al obtener cursos: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener cursos disponibles para matricularse
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
    @GetMapping("/cursos-disponibles")
    public ResponseEntity<List<Map<String, Object>>> obtenerCursosDisponibles(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            List<Curso> cursosDisponibles = estudianteService.obtenerCursosDisponibles(estudiante.getId());
            
            List<Map<String, Object>> cursosInfo = cursosDisponibles.stream()
                .map(curso -> {
                    Map<String, Object> cursoInfo = new HashMap<>();
                    cursoInfo.put("id", curso.getId());
                    cursoInfo.put("nombre", curso.getNombre());
                    cursoInfo.put("duracion", curso.getDuracion());
                    cursoInfo.put("horario", curso.getHorario());
                    cursoInfo.put("descripcion", curso.getDescripcion());
                    if (curso.getProfesor() != null) {
                        cursoInfo.put("profesor", curso.getProfesor().getNombre() + " " + curso.getProfesor().getApellido());
                    } else {
                        cursoInfo.put("profesor", "Sin asignar");
                    }
                    return cursoInfo;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(cursosInfo);
        } catch (Exception e) {
            System.err.println("Error al obtener cursos disponibles: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Matricularse en un curso
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
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
            System.err.println("Error al matricular: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Error interno del servidor: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Desmatricularse de un curso
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
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
            System.err.println("Error al desmatricular: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Error interno del servidor: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Obtener calificaciones del estudiante
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
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
            System.err.println("Error al obtener notas: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener promedio de notas
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
    @GetMapping("/promedio")
    public ResponseEntity<Map<String, Object>> obtenerPromedio(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            Double promedio = estudianteService.calcularPromedioNotas(estudiante.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("promedio", promedio != null ? promedio : 0.0);
            response.put("estudianteId", estudiante.getId());
            response.put("estudiante", estudiante.getNombre() + " " + estudiante.getApellido());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error al obtener promedio: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener estadísticas del estudiante
    @PreAuthorize("hasRole('ROLE_ESTUDIANTE')")
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Usuario usuario = usuarioRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            
            int totalCursos = estudiante.getCursos() != null ? estudiante.getCursos().size() : 0;
            List<Nota> notas = notaService.buscarPorEstudiante(estudiante);
            int totalNotas = notas != null ? notas.size() : 0;
            Double promedio = estudianteService.calcularPromedioNotas(estudiante.getId());
            
            Map<String, Object> estadisticas = new HashMap<>();
            estadisticas.put("totalCursos", totalCursos);
            estadisticas.put("totalNotas", totalNotas);
            estadisticas.put("promedio", promedio != null ? promedio : 0.0);
            estadisticas.put("estudianteNombre", estudiante.getNombre() + " " + estudiante.getApellido());
            estadisticas.put("estudianteId", estudiante.getId());
            
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            System.err.println("Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}