package com.sistema.controller;

import com.sistema.modelo.Pelicula;
import com.sistema.modelo.Distribuidora;
import com.sistema.modelo.Tarifa;
import com.sistema.repository.PeliculaRepository;
import com.sistema.repository.DistribuidoraRepository;
import com.sistema.repository.TarifaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/peliculas")
public class PeliculaController {

    private final PeliculaRepository peliculaRepository;
    private final DistribuidoraRepository distribuidoraRepository;
    private final TarifaRepository tarifaRepository;

    // Constructor actualizado para inyección de todas las dependencias
    public PeliculaController(PeliculaRepository peliculaRepository, 
                              DistribuidoraRepository distribuidoraRepository, 
                              TarifaRepository tarifaRepository) {
        this.peliculaRepository = peliculaRepository;
        this.distribuidoraRepository = distribuidoraRepository;
        this.tarifaRepository = tarifaRepository;
    }

    // 1. Obtener todas las películas
    @GetMapping
    public List<Pelicula> listarPeliculas() {
        return peliculaRepository.findAll();
    }

    // 2. Obtener una película por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pelicula> obtenerPelicula(@PathVariable Long id) {
        return peliculaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Crear un nuevo empleado (POST /api/peliculas) - CORREGIDO
    @PostMapping
    public ResponseEntity<Pelicula> crearPelicula(@RequestBody Pelicula pelicula) {
        // Validación de unicidad
        if (peliculaRepository.existsByTitulo(pelicula.getTitulo())) {
            return ResponseEntity.badRequest().body(null); 
        }

        // === Lógica para evitar TransientObjectException (CORREGIDA LA LLAMADA AL ID) ===
        
        // 1. Obtener IDs de las relaciones usando los métodos correctos
        Long distribuidoraId = pelicula.getDistribuidora() != null ? pelicula.getDistribuidora().getIdDistribuidora() : null;
        Long tarifaId = pelicula.getTarifa() != null ? pelicula.getTarifa().getIdTarifa() : null; 
        
        // --- Manejo de Distribuidora ---
        if (distribuidoraId == null) {
            // Error si no se proporciona ID de distribuidora
            return ResponseEntity.badRequest().body(null); 
        }
        Optional<Distribuidora> distribuidoraOpt = distribuidoraRepository.findById(distribuidoraId);
        if (distribuidoraOpt.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Distribuidora no encontrada
        }
        pelicula.setDistribuidora(distribuidoraOpt.get());
        
        // --- Manejo de Tarifa ---
        if (tarifaId == null) {
            // Error si no se proporciona ID de tarifa
            return ResponseEntity.badRequest().body(null);
        }
        Optional<Tarifa> tarifaOpt = tarifaRepository.findById(tarifaId);
        if (tarifaOpt.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Tarifa no encontrada
        }
        pelicula.setTarifa(tarifaOpt.get());
        
        // 4. Guardar la entidad
        Pelicula nueva = peliculaRepository.save(pelicula);
        return ResponseEntity.ok(nueva);
    }

    // 4. Actualizar una película existente (requiere una corrección similar si la haces más robusta)
    @PutMapping("/{id}")
    public ResponseEntity<Pelicula> actualizarPelicula(@PathVariable Long id, @RequestBody Pelicula datos) {
        return peliculaRepository.findById(id).map(p -> {
            p.setTitulo(datos.getTitulo());
            p.setAnio(datos.getAnio());
            p.setDirector(datos.getDirector());
            p.setReparto(datos.getReparto());
            p.setGenero(datos.getGenero());
            p.setClasificacion(datos.getClasificacion());
            p.setPortadaUrl(datos.getPortadaUrl());
            
            // Nota: Para la actualización robusta, también se deberían cargar las instancias 
            // de Distribuidora y Tarifa con findById si cambian los IDs.
            p.setDistribuidora(datos.getDistribuidora());
            p.setTarifa(datos.getTarifa());
            
            Pelicula actualizada = peliculaRepository.save(p);
            return ResponseEntity.ok(actualizada);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Eliminar una película
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPelicula(@PathVariable Long id) {
        if (!peliculaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        peliculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}