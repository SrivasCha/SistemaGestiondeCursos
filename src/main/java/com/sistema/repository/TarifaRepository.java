package com.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sistema.modelo.Tarifa;
import java.util.Optional;

public interface TarifaRepository extends JpaRepository<Tarifa, Long> {

    Optional<Tarifa> findByTipo(String tipo);

    boolean existsByTipo(String tipo);
}
