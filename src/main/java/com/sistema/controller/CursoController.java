package com.sistema.controller;

import com.sistema.modelo.Curso;
import com.sistema.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curso")
@CrossOrigin(origins = "http://localhost:5173") // Permite peticiones desde el frontend
public class CursoController {

    @Autowired
    private CursoService service;

    // Todos los roles pueden listar cursos
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR', 'ESTUDIANTE')")
    @GetMapping
    public List<Curso> listar() {
        return service.listar();
    }

    // ADMIN y PROFESOR pueden crear nuevos cursos
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    @PostMapping
    public Curso guardar(@RequestBody Curso curso) {
        return service.guardar(curso);
    }

    // ADMIN y PROFESOR pueden actualizar cursos existentes
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    @PutMapping("/{id}")
    public Curso actualizar(@PathVariable Long id, @RequestBody Curso curso) {
        Curso cursoExistente = service.obtenerPorId(id);
        if (cursoExistente != null) {
            cursoExistente.setNombre(curso.getNombre());
            cursoExistente.setDuracion(curso.getDuracion());
            cursoExistente.setHorario(curso.getHorario());
            return service.guardar(cursoExistente);
        }
        return null;
    }

    // ADMIN y PROFESOR pueden eliminar cursos
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    // Obtener un curso por ID (todos los roles)
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR', 'ESTUDIANTE')")
    @GetMapping("/{id}")
    public Curso obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }
}
