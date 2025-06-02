package com.sistema.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sistema.modelo.Profesor;
import com.sistema.service.ProfesorService;

import java.util.List;

@RestController
@RequestMapping("/api/profesor")
public class ProfesorController {
    @Autowired
    private ProfesorService service;
    
    @GetMapping
    public List<Profesor> listar() {
        return service.listar();
    }
    
    @PostMapping
    public Profesor guardar(@RequestBody Profesor profesor) {
        return service.guardar(profesor);
    }
    
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}