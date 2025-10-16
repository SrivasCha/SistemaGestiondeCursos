package com.sistema.controller;

import com.sistema.modelo.Cliente;
import com.sistema.repository.ClienteRepository;
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
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private AlquilerRepository alquilerRepository;

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearCliente(@RequestBody Cliente cliente) {
        try {
            // Validar que el email no esté duplicado
            if (clienteRepository.existsByEmail(cliente.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Ya existe un cliente con ese email"));
            }
            
            // Validar que el número de identificación no esté duplicado
            if (cliente.getNumeroIdentificacion() != null && 
                clienteRepository.existsByNumeroIdentificacion(cliente.getNumeroIdentificacion())) {
                return ResponseEntity.badRequest()
                    .body(crearMensajeError("Ya existe un cliente con ese número de identificación"));
            }
            
            Cliente nuevo = clienteRepository.save(cliente);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al crear el cliente: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCliente(@PathVariable Long id, @RequestBody Cliente datos) {
        return clienteRepository.findById(id).map(cliente -> {
            cliente.setNombre(datos.getNombre());
            cliente.setApellido(datos.getApellido());
            cliente.setEmail(datos.getEmail());
            cliente.setTelefono(datos.getTelefono());
            cliente.setDireccion(datos.getDireccion());
            cliente.setNumeroIdentificacion(datos.getNumeroIdentificacion());
            cliente.setFechaNacimiento(datos.getFechaNacimiento());
            cliente.setFotoPerfil(datos.getFotoPerfil());
            
            Cliente actualizado = clienteRepository.save(cliente);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Long id) {
        try {
            if (!clienteRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // 🔒 VALIDACIÓN CRÍTICA: Verificar si tiene alquileres activos
            long alquileresActivos = alquilerRepository.countByClienteIdAndEstado(id, "Activo");
            
            if (alquileresActivos > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(crearMensajeError(
                        "No se puede eliminar el cliente porque tiene " + alquileresActivos + 
                        " alquiler(es) activo(s). Por favor, procese primero las devoluciones."
                    ));
            }
            
            // Verificar si tiene alquileres históricos
            long totalAlquileres = alquilerRepository.countByClienteId(id);
            
            if (totalAlquileres > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(crearMensajeError(
                        "No se puede eliminar el cliente porque tiene " + totalAlquileres + 
                        " alquiler(es) en el historial. Los datos de clientes con historial deben preservarse."
                    ));
            }
            
            clienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(crearMensajeError("Error al eliminar el cliente: " + e.getMessage()));
        }
    }

    private Map<String, String> crearMensajeError(String mensaje) {
        Map<String, String> error = new HashMap<>();
        error.put("message", mensaje);
        return error;
    }
}