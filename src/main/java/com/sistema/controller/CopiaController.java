package com.sistema.controller;

import com.sistema.modelo.Copia;
import com.sistema.modelo.Pelicula;
import com.sistema.repository.CopiaRepository;
import com.sistema.repository.PeliculaRepository;
import com.sistema.repository.AlquilerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/copias")
public class CopiaController {

    private final CopiaRepository copiaRepository;
    private final PeliculaRepository peliculaRepository;
    private final AlquilerRepository alquilerRepository;

    @Autowired
    public CopiaController(CopiaRepository copiaRepository, 
                           PeliculaRepository peliculaRepository,
                           AlquilerRepository alquilerRepository) {
        this.copiaRepository = copiaRepository;
        this.peliculaRepository = peliculaRepository;
        this.alquilerRepository = alquilerRepository;
    }

    @GetMapping
    public List<Copia> listarCopias() {
        return copiaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Copia> obtenerCopia(@PathVariable Long id) {
        return copiaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearCopia(@RequestBody Copia copia) {
        try {
            // 🔑 CORRECCIÓN: Validar que codigoInventario NO sea nulo/vacío
            if (copia.getCodigoInventario() == null || copia.getCodigoInventario().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("El código de inventario es obligatorio"));
            }
            
            // Validar unicidad del número de registro
            if (copiaRepository.existsByNumeroRegistro(copia.getNumeroRegistro())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("El número de registro ya existe"));
            }
            
            // Validar unicidad del código de inventario (ya sabemos que no es null)
            if (copiaRepository.existsByCodigoInventario(copia.getCodigoInventario())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("El código de inventario ya existe"));
            }

            Pelicula peliculaRecibida = copia.getPelicula();
            
            if (peliculaRecibida == null || peliculaRecibida.getIdPelicula() == null) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Se requiere el ID de la Película"));
            }

            Long idPelicula = peliculaRecibida.getIdPelicula();

            if (!peliculaRepository.existsById(idPelicula)) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Película con ID " + idPelicula + " no encontrada"));
            }

            // Usar findById para obtener la referencia completa antes de guardar
            Optional<Pelicula> peliculaOpt = peliculaRepository.findById(idPelicula);
            if (peliculaOpt.isEmpty()) {
                 return ResponseEntity.badRequest()
                    .body(crearMensajeError("Película con ID " + idPelicula + " no encontrada"));
            }
            copia.setPelicula(peliculaOpt.get());
            
            // Asegurar que se inicialice correctamente el estado
            if (copia.getDisponible() == null) {
                copia.setDisponible(true);
            }
            // Esto también actualiza el campo 'estado' internamente
            copia.setDisponible(copia.getDisponible()); 

            Copia nueva = copiaRepository.save(copia);
            return ResponseEntity.ok(nueva);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al crear la copia: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCopia(@PathVariable Long id, @RequestBody Copia datos) {
        
        Optional<Copia> copiaOptional = copiaRepository.findById(id);

        if (copiaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Copia copiaExistente = copiaOptional.get();
        
        // 🔑 Nueva validación para asegurar que el campo no se actualice a null
        if (datos.getCodigoInventario() == null || datos.getCodigoInventario().trim().isEmpty()) {
             return ResponseEntity.badRequest()
                .body(crearMensajeError("El código de inventario es obligatorio"));
        }
        
        // Validar unicidad en PUT: numeroRegistro
        if (!copiaExistente.getNumeroRegistro().equals(datos.getNumeroRegistro()) && 
            copiaRepository.existsByNumeroRegistro(datos.getNumeroRegistro())) {
             return ResponseEntity.badRequest()
                .body(crearMensajeError("El número de registro ya existe"));
        }
        
        // Validar unicidad en PUT: codigoInventario
        if (!copiaExistente.getCodigoInventario().equals(datos.getCodigoInventario()) && 
            copiaRepository.existsByCodigoInventario(datos.getCodigoInventario())) {
             return ResponseEntity.badRequest()
                .body(crearMensajeError("El código de inventario ya existe"));
        }

        // Manejo de la actualización de Pelicula
        if (datos.getPelicula() != null && datos.getPelicula().getIdPelicula() != null) {
            Long nuevoIdPelicula = datos.getPelicula().getIdPelicula();
            
            // Mejorar: usar findById en lugar de existsById + getReferenceById
            Optional<Pelicula> peliculaOpt = peliculaRepository.findById(nuevoIdPelicula);
            
            if (peliculaOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("La Película con ID " + nuevoIdPelicula + " no fue encontrada"));
            }
            
            copiaExistente.setPelicula(peliculaOpt.get());
        }

        // Actualizar campos
        copiaExistente.setNumeroRegistro(datos.getNumeroRegistro());
        copiaExistente.setCodigoInventario(datos.getCodigoInventario());
        copiaExistente.setFormato(datos.getFormato());
        
        if (datos.getDisponible() != null) {
            copiaExistente.setDisponible(datos.getDisponible());
            // El setter de setDisponible ya maneja setEstado
        }
        
        Copia actualizada = copiaRepository.save(copiaExistente);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCopia(@PathVariable Long id) {
        try {
            if (!copiaRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // 🔒 VALIDACIÓN CRÍTICA: Verificar si tiene alquileres activos
            long alquileresActivos = alquilerRepository.countByCopiaIdCopiaAndEstado(id, "Activo");
            
            if (alquileresActivos > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(crearMensajeError(
                        "No se puede eliminar la copia porque está actualmente alquilada. " +
                        "Por favor, procese primero la devolución."
                    ));
            }
            
            // Verificar si tiene alquileres históricos
            long totalAlquileres = alquilerRepository.countByCopiaIdCopia(id);
            
            if (totalAlquileres > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(crearMensajeError(
                        "No se puede eliminar la copia porque tiene " + totalAlquileres + 
                        " alquiler(es) en el historial. Las copias con historial deben preservarse."
                    ));
            }
            
            copiaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al eliminar la copia: " + e.getMessage()));
        }
    }

    private Map<String, String> crearMensajeError(String mensaje) {
        Map<String, String> error = new HashMap<>();
        error.put("message", mensaje);
        return error;
    }
}