package com.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sistema.modelo.Cliente;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmail(String email);

    Optional<Cliente> findByNumeroIdentificacion(String numeroIdentificacion);

    boolean existsByEmail(String email);

    boolean existsByNumeroIdentificacion(String numeroIdentificacion);
}
