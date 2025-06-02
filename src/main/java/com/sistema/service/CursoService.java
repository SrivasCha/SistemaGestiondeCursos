package com.sistema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistema.modelo.Curso;
import com.sistema.repository.CursoRepository;

import java.util.List;

@Service
public class CursoService {
    @Autowired
    private CursoRepository repository;
    
    public List<Curso> listar() {
        return repository.findAll();
    }
    
    public Curso guardar(Curso curso) {
        return repository.save(curso);
    }
    
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

        public Curso obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}