package com.sistema.controller;

import com.sistema.modelo.Empleado;
import com.sistema.repository.EmpleadoRepository;
import com.sistema.repository.AlquilerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired
    private EmpleadoRepository empleadoRepository;
    
    @Autowired
    private AlquilerRepository alquilerRepository;

    @GetMapping
    public List<Empleado> listarEmpleados() {
        return empleadoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> obtenerEmpleado(@PathVariable Long id) {
        return empleadoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearEmpleado(@RequestBody Empleado empleado) {
        try {
            // Validar que el email no esté duplicado
            if (empleadoRepository.existsByEmail(empleado.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Ya existe un empleado con ese email"));
            }
            
            // Validar que el número de identificación no esté duplicado
            if (empleado.getNumeroIdentificacion() != null && 
                empleadoRepository.existsByNumeroIdentificacion(empleado.getNumeroIdentificacion())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Ya existe un empleado con ese número de identificación"));
            }
            
            Empleado nuevo = empleadoRepository.save(empleado);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo); // Retornar 201 Created
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al crear el empleado: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEmpleado(@PathVariable Long id, @RequestBody Empleado datos) {
        return empleadoRepository.findById(id).map(empleado -> {
            
            // 🔑 1. VALIDACIÓN DE EMAIL (excluyendo el empleado actual)
            if (empleadoRepository.findByEmailAndIdIsNot(datos.getEmail(), id).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("El email " + datos.getEmail() + " ya está registrado para otro empleado."));
            }
            
            // 🔑 2. VALIDACIÓN DE NÚMERO DE IDENTIFICACIÓN (excluyendo el empleado actual)
            if (datos.getNumeroIdentificacion() != null && 
                empleadoRepository.findByNumeroIdentificacionAndIdIsNot(datos.getNumeroIdentificacion(), id).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("El número de identificación ya está registrado para otro empleado."));
            }

            // 3. ACTUALIZACIÓN DE CAMPOS
            empleado.setNombre(datos.getNombre());
            empleado.setApellido(datos.getApellido());
            empleado.setCargo(datos.getCargo());
            empleado.setEmail(datos.getEmail());
            empleado.setTelefono(datos.getTelefono());
            empleado.setNumeroIdentificacion(datos.getNumeroIdentificacion());
            empleado.setFechaContratacion(datos.getFechaContratacion());
            
            Empleado actualizado = empleadoRepository.save(empleado);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable Long id) {
        try {
            if (!empleadoRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // 🔒 VALIDACIÓN CRÍTICA: Verificar si tiene alquileres registrados
            long totalAlquileres = alquilerRepository.countByEmpleadoId(id);
            
            if (totalAlquileres > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(crearMensajeError(
                        "No se puede eliminar el empleado porque tiene " + totalAlquileres + 
                        " alquiler(es) registrado(s) a su nombre. Los datos de empleados con historial deben preservarse."
                    ));
            }
            
            empleadoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al eliminar el empleado: " + e.getMessage()));
        }
    }

    private Map<String, String> crearMensajeError(String mensaje) {
        Map<String, String> error = new HashMap<>();
        error.put("message", mensaje);
        return error;
    }
}