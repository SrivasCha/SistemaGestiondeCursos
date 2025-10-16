package com.sistema.controller;

import com.sistema.modelo.Distribuidora;
import com.sistema.repository.DistribuidoraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/distribuidoras")
public class DistribuidoraController {

    private final DistribuidoraRepository distribuidoraRepository;

    public DistribuidoraController(DistribuidoraRepository distribuidoraRepository) {
        this.distribuidoraRepository = distribuidoraRepository;
    }

    @GetMapping
    public List<Distribuidora> listarDistribuidoras() {
        return distribuidoraRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Distribuidora> obtenerDistribuidora(@PathVariable Long id) {
        return distribuidoraRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Distribuidora> crearDistribuidora(@RequestBody Distribuidora distribuidora) {
        if (distribuidoraRepository.existsByNombre(distribuidora.getNombre())) {
            return ResponseEntity.badRequest().build();
        }
        Distribuidora nueva = distribuidoraRepository.save(distribuidora);
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Distribuidora> actualizarDistribuidora(@PathVariable Long id, @RequestBody Distribuidora datos) {
        return distribuidoraRepository.findById(id).map(dist -> {
            dist.setNombre(datos.getNombre());
            dist.setDireccion(datos.getDireccion());
            dist.setUrl(datos.getUrl());
            dist.setTelefono(datos.getTelefono());
            dist.setEmail(datos.getEmail());
            Distribuidora actualizada = distribuidoraRepository.save(dist);
            return ResponseEntity.ok(actualizada);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDistribuidora(@PathVariable Long id) {
        if (!distribuidoraRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        distribuidoraRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
