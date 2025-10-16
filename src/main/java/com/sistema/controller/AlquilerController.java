package com.sistema.controller;

import com.sistema.modelo.Alquiler;
import com.sistema.modelo.Cliente;
import com.sistema.modelo.Copia;
import com.sistema.modelo.Empleado;
import com.sistema.repository.AlquilerRepository;
import com.sistema.repository.ClienteRepository;
import com.sistema.repository.CopiaRepository;
import com.sistema.repository.EmpleadoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/alquileres")
public class AlquilerController {

    private final AlquilerRepository alquilerRepository;
    private final ClienteRepository clienteRepository; 
    private final CopiaRepository copiaRepository;
    private final EmpleadoRepository empleadoRepository;

    public AlquilerController(AlquilerRepository alquilerRepository, 
                              ClienteRepository clienteRepository, 
                              CopiaRepository copiaRepository,
                              EmpleadoRepository empleadoRepository) {
        this.alquilerRepository = alquilerRepository;
        this.clienteRepository = clienteRepository;
        this.copiaRepository = copiaRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @GetMapping
    public List<Alquiler> listarAlquileres() {
        return alquilerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alquiler> obtenerAlquiler(@PathVariable Long id) {
        return alquilerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crearAlquiler(@RequestBody Alquiler alquiler) {
        try {
            System.out.println("=== INICIO CREACIÓN DE ALQUILER ===");
            System.out.println("Alquiler recibido: " + alquiler);
            
            // Validar que los IDs estén presentes
            Long clienteId = (alquiler.getCliente() != null) ? alquiler.getCliente().getId() : null;
            Long copiaId = (alquiler.getCopia() != null) ? alquiler.getCopia().getIdCopia() : null;
            Long empleadoId = (alquiler.getEmpleado() != null) ? alquiler.getEmpleado().getId() : null;
            
            System.out.println("IDs extraídos - Cliente: " + clienteId + ", Copia: " + copiaId + ", Empleado: " + empleadoId);
            
            if (clienteId == null || copiaId == null || empleadoId == null) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Cliente, Copia y Empleado son obligatorios"));
            }

            // Buscar las entidades
            Optional<Cliente> clienteOptional = clienteRepository.findById(clienteId);
            Optional<Copia> copiaOptional = copiaRepository.findById(copiaId);
            Optional<Empleado> empleadoOptional = empleadoRepository.findById(empleadoId);

            if (clienteOptional.isEmpty()) {
                System.out.println("ERROR: Cliente no encontrado con ID: " + clienteId);
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Cliente no encontrado"));
            }
            if (copiaOptional.isEmpty()) {
                System.out.println("ERROR: Copia no encontrada con ID: " + copiaId);
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Copia no encontrada"));
            }
            if (empleadoOptional.isEmpty()) {
                System.out.println("ERROR: Empleado no encontrado con ID: " + empleadoId);
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Empleado no encontrado"));
            }

            Copia copia = copiaOptional.get();
            System.out.println("Copia encontrada: " + copia);
            System.out.println("Disponibilidad de copia: " + copia.getDisponible());
            
            // Validar que la copia esté disponible
            if (copia.getDisponible() == null || !copia.getDisponible()) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("La copia seleccionada no está disponible para alquiler"));
            }

            // Crear un nuevo objeto Alquiler limpio
            Alquiler nuevoAlquiler = new Alquiler();
            nuevoAlquiler.setFechaAlquiler(alquiler.getFechaAlquiler() != null ? alquiler.getFechaAlquiler() : LocalDate.now());
            nuevoAlquiler.setCliente(clienteOptional.get());
            nuevoAlquiler.setCopia(copia);
            nuevoAlquiler.setEmpleado(empleadoOptional.get());
            nuevoAlquiler.setEstado("Activo");
            
            System.out.println("Nuevo alquiler creado: " + nuevoAlquiler);
            
            // Calcular fecha de devolución esperada
            nuevoAlquiler.calcularFechaDevolucionEsperada();
            System.out.println("Fecha devolución esperada calculada: " + nuevoAlquiler.getFechaDevolucionEsperada());
            
            // Calcular importe inicial
            nuevoAlquiler.calcularImporte();
            System.out.println("Importe calculado: " + nuevoAlquiler.getImporteTotal());
            
            // Marcar la copia como no disponible
            copia.setDisponible(false);
            copiaRepository.save(copia);
            System.out.println("Copia marcada como no disponible");
            
            // Guardar el alquiler
            Alquiler guardado = alquilerRepository.save(nuevoAlquiler);
            System.out.println("Alquiler guardado exitosamente con ID: " + guardado.getIdAlquiler());
            System.out.println("=== FIN CREACIÓN DE ALQUILER ===");
            
            return ResponseEntity.ok(guardado);
            
        } catch (Exception e) {
            System.err.println("ERROR COMPLETO AL CREAR ALQUILER:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al crear el alquiler: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> actualizarAlquiler(@PathVariable Long id, @RequestBody Alquiler datos) {
        Optional<Alquiler> alquilerOptional = alquilerRepository.findById(id);
        
        if (alquilerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Alquiler alquiler = alquilerOptional.get();
        
        if (datos.getFechaAlquiler() != null) {
            alquiler.setFechaAlquiler(datos.getFechaAlquiler());
        }
        
        // Actualizar cliente si se proporciona
        if (datos.getCliente() != null && datos.getCliente().getId() != null) {
            clienteRepository.findById(datos.getCliente().getId())
                .ifPresent(alquiler::setCliente);
        }
        
        // Actualizar copia si se proporciona
        if (datos.getCopia() != null && datos.getCopia().getIdCopia() != null) {
            copiaRepository.findById(datos.getCopia().getIdCopia())
                .ifPresent(alquiler::setCopia);
        }
        
        // Actualizar empleado si se proporciona
        if (datos.getEmpleado() != null && datos.getEmpleado().getId() != null) {
            empleadoRepository.findById(datos.getEmpleado().getId())
                .ifPresent(alquiler::setEmpleado);
        }
        
        if (datos.getFechaDevolucion() != null) {
            alquiler.setFechaDevolucion(datos.getFechaDevolucion());
        }
        
        alquiler.calcularImporte();
        
        Alquiler actualizado = alquilerRepository.save(alquiler);
        return ResponseEntity.ok(actualizado);
    }

    @PutMapping("/devolver/{id}")
    @Transactional
    public ResponseEntity<?> devolverAlquiler(@PathVariable Long id) {
        try {
            System.out.println("=== PROCESANDO DEVOLUCIÓN ===");
            System.out.println("ID Alquiler: " + id);
            
            Optional<Alquiler> alquilerOptional = alquilerRepository.findById(id);

            if (alquilerOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Alquiler alquiler = alquilerOptional.get();

            // Verificar si ya fue devuelto
            if (alquiler.getFechaDevolucion() != null || "Finalizado".equals(alquiler.getEstado())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("El alquiler ya fue devuelto previamente"));
            }

            // Establecer fecha de devolución (hoy)
            alquiler.setFechaDevolucion(LocalDate.now());
            alquiler.setEstado("Finalizado");

            // Recalcular el importe con penalizaciones
            alquiler.calcularImporte();
            
            System.out.println("Importe total con penalización: " + alquiler.getImporteTotal());

            // Marcar la copia como disponible nuevamente
            Copia copia = alquiler.getCopia();
            if (copia != null) {
                copia.setDisponible(true);
                copiaRepository.save(copia);
                System.out.println("Copia liberada: " + copia.getIdCopia());
            }

            // Guardar el alquiler actualizado
            Alquiler actualizado = alquilerRepository.save(alquiler);
            
            // Crear respuesta con información detallada
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("alquiler", actualizado);
            respuesta.put("mensaje", "Devolución procesada exitosamente");
            
            // Calcular días de retraso si los hay
            if (actualizado.getFechaDevolucionEsperada() != null) {
                long diasRetraso = java.time.temporal.ChronoUnit.DAYS.between(
                    actualizado.getFechaDevolucionEsperada(), 
                    actualizado.getFechaDevolucion()
                );
                if (diasRetraso > 0) {
                    respuesta.put("diasRetraso", diasRetraso);
                    respuesta.put("penalizacionAplicada", true);
                    System.out.println("Días de retraso: " + diasRetraso);
                } else {
                    respuesta.put("diasRetraso", 0);
                    respuesta.put("penalizacionAplicada", false);
                }
            }
            
            System.out.println("=== DEVOLUCIÓN COMPLETADA ===");
            
            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            System.err.println("ERROR EN DEVOLUCIÓN:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al procesar la devolución: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarAlquiler(@PathVariable Long id) {
        try {
            Optional<Alquiler> alquilerOptional = alquilerRepository.findById(id);
            
            if (alquilerOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Alquiler alquiler = alquilerOptional.get();
            
            // Si el alquiler está activo, liberar la copia
            if ("Activo".equals(alquiler.getEstado()) && alquiler.getCopia() != null) {
                Copia copia = alquiler.getCopia();
                copia.setDisponible(true);
                copiaRepository.save(copia);
            }
            
            alquilerRepository.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al eliminar el alquiler: " + e.getMessage()));
        }
    }

    private Map<String, String> crearMensajeError(String mensaje) {
        Map<String, String> error = new HashMap<>();
        error.put("message", mensaje);
        return error;
    }
}