package com.sistema.repository;

import com.sistema.modelo.Copia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CopiaRepository extends JpaRepository<Copia, Long> {
    
    boolean existsByNumeroRegistro(String numeroRegistro);
    
    boolean existsByCodigoInventario(String codigoInventario);
}