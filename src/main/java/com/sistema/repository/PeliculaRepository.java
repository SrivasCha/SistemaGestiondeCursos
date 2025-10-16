package com.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sistema.modelo.Pelicula;
import java.util.List;
import java.util.Optional;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {

    List<Pelicula> findByGenero(String genero);

    List<Pelicula> findByAnio(Integer anio);

    Optional<Pelicula> findByTitulo(String titulo);

    boolean existsByTitulo(String titulo);
}
