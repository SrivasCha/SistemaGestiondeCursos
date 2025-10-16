package com.sistema.repository;

import com.sistema.modelo.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    // Para validación en POST: comprueba si existe por email
    boolean existsByEmail(String email);

    // Para validación en POST: comprueba si existe por identificación
    boolean existsByNumeroIdentificacion(String numeroIdentificacion);
    
    // 🔑 Para validación en PUT: encuentra un empleado por email que NO sea el ID actual
    Optional<Empleado> findByEmailAndIdIsNot(String email, Long id);
    
    // 🔑 Para validación en PUT: encuentra un empleado por identificación que NO sea el ID actual
    Optional<Empleado> findByNumeroIdentificacionAndIdIsNot(String numeroIdentificacion, Long id);
}