package com.sistema.repository;

import com.sistema.modelo.*;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.modelo.Estudiante;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {}