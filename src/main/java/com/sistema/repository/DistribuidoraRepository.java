package com.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sistema.modelo.Distribuidora;
import java.util.Optional;

public interface DistribuidoraRepository extends JpaRepository<Distribuidora, Long> {

    Optional<Distribuidora> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
