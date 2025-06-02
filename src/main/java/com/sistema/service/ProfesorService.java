package com.sistema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistema.modelo.Profesor;
import com.sistema.repository.ProfesorRepository;

import java.util.List;

@Service
public class ProfesorService {
    @Autowired
    private ProfesorRepository repository;
    
    public List<Profesor> listar() {
        return repository.findAll();
    }
    
    public Profesor guardar(Profesor profesor) {
        return repository.save(profesor);
    }
    
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}