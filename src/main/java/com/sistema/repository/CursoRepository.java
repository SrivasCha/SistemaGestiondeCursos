package com.sistema.repository;

import com.sistema.modelo.*;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.modelo.Curso;

public interface CursoRepository extends JpaRepository<Curso, Long> {}