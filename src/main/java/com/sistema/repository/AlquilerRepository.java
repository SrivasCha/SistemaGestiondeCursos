package com.sistema.repository;

import com.sistema.modelo.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {
    
    // Consultas para validar eliminación de clientes
    long countByClienteIdAndEstado(Long clienteId, String estado);
    
    @Query("SELECT COUNT(a) FROM Alquiler a WHERE a.cliente.id = :clienteId")
    long countByClienteId(@Param("clienteId") Long clienteId);
    
    // Consultas para validar eliminación de empleados
    @Query("SELECT COUNT(a) FROM Alquiler a WHERE a.empleado.id = :empleadoId")
    long countByEmpleadoId(@Param("empleadoId") Long empleadoId);
    
    // Consultas para validar eliminación de copias
    long countByCopiaIdCopiaAndEstado(Long copiaId, String estado);
    
    long countByCopiaIdCopia(Long copiaId);
    
    // Consultas adicionales útiles
    List<Alquiler> findByEstado(String estado);
    
    @Query("SELECT a FROM Alquiler a WHERE a.cliente.id = :clienteId ORDER BY a.fechaAlquiler DESC")
    List<Alquiler> findByClienteId(@Param("clienteId") Long clienteId);
    
    @Query("SELECT a FROM Alquiler a WHERE a.copia.idCopia = :copiaId ORDER BY a.fechaAlquiler DESC")
    List<Alquiler> findByCopiaId(@Param("copiaId") Long copiaId);
    
    @Query("SELECT a FROM Alquiler a WHERE a.empleado.id = :empleadoId ORDER BY a.fechaAlquiler DESC")
    List<Alquiler> findByEmpleadoId(@Param("empleadoId") Long empleadoId);
}