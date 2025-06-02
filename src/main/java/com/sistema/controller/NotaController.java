package com.sistema.controller;

import com.sistema.modelo.*;
import com.sistema.repository.*;
import com.sistema.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
@CrossOrigin("*")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @Autowired
    private EstudianteRepository estudianteRepo;

    @Autowired
    private CursoRepository cursoRepo;

    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    @GetMapping("/")
    public List<Nota> listarNotas() {
        return notaService.listarNotas();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public Nota guardarNota(@RequestBody Nota nota) {
        return notaService.guardarNota(nota);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    @GetMapping("/estudiante/{id}")
    public List<Nota> notasPorEstudiante(@PathVariable Long id) {
        Estudiante e = estudianteRepo.findById(id).orElseThrow();
        return notaService.buscarPorEstudiante(e);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    @GetMapping("/curso/{id}")
    public List<Nota> notasPorCurso(@PathVariable Long id) {
        Curso c = cursoRepo.findById(id).orElseThrow();
        return notaService.buscarPorCurso(c);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void eliminarNota(@PathVariable Long id) {
        notaService.eliminarNota(id);
    }

    @PreAuthorize("hasRole('ESTUDIANTE')")
@GetMapping("/mis-notas")
public ResponseEntity<List<Nota>> obtenerMisNotas(@AuthenticationPrincipal Usuario usuario) {
    Estudiante estudiante = estudianteRepo.findByUsuario(usuario)
        .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
    return ResponseEntity.ok(notaService.buscarPorEstudiante(estudiante));
}

}