package com.sistema.repository;

import com.sistema.modelo.*;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.modelo.Profesor;

public interface ProfesorRepository extends JpaRepository<Profesor, Long> {}