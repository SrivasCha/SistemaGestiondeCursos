package com.sistema.controller;

import com.sistema.modelo.Tarifa;
import com.sistema.repository.TarifaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tarifas")
@CrossOrigin(origins = "http://localhost:3000")
public class TarifaController {

    @Autowired
    private TarifaRepository tarifaRepository;

    // ✅ Obtener todas las tarifas
    @GetMapping
    public List<Tarifa> listarTarifas() {
        return tarifaRepository.findAll();
    }

    // ✅ Obtener una tarifa por ID
    @GetMapping("/{id}")
    public ResponseEntity<Tarifa> obtenerTarifaPorId(@PathVariable Long id) {
        Optional<Tarifa> tarifa = tarifaRepository.findById(id);
        return tarifa.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Crear una nueva tarifa
    @PostMapping
    public ResponseEntity<Tarifa> crearTarifa(@RequestBody Tarifa tarifa) {
        if (tarifa.getTipo() == null || tarifa.getTipo().isEmpty() || tarifa.getPrecio() == null) {
            return ResponseEntity.badRequest().build();
        }
        Tarifa nuevaTarifa = tarifaRepository.save(tarifa);
        return ResponseEntity.ok(nuevaTarifa);
    }

    // ✅ Actualizar una tarifa existente - CORREGIDO
    @PutMapping("/{id}")
    public ResponseEntity<Tarifa> actualizarTarifa(@PathVariable Long id, @RequestBody Tarifa datos) {
        Optional<Tarifa> optionalTarifa = tarifaRepository.findById(id);
        if (optionalTarifa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tarifa tarifa = optionalTarifa.get();

        // Actualizamos solo los campos existentes
        if (datos.getTipo() != null) tarifa.setTipo(datos.getTipo());
        if (datos.getPrecio() != null) tarifa.setPrecio(datos.getPrecio());
        
        // ⬅️ ¡CORRECCIÓN CLAVE! Agregar la actualización de diasPrestamo
        if (datos.getDiasPrestamo() != null) tarifa.setDiasPrestamo(datos.getDiasPrestamo()); 

        Tarifa actualizada = tarifaRepository.save(tarifa);
        return ResponseEntity.ok(actualizada);
    }

    // ✅ Eliminar una tarifa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarifa(@PathVariable Long id) {
        if (!tarifaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tarifaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
