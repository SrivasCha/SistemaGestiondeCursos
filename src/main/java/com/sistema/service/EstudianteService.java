package com.sistema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistema.modelo.Estudiante;
import com.sistema.repository.EstudianteRepository;

import java.util.List;

@Service
public class EstudianteService {
    @Autowired
    private EstudianteRepository repository;
    
    public List<Estudiante> listar() {
        return repository.findAll();
    }
    
    public Estudiante guardar(Estudiante estudiante) {
        return repository.save(estudiante);
    }
    
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
    
    public Estudiante obtenerPorId(Long id) {
        return repository.findById(id).orElse(null); // Implementación del método
    }
}