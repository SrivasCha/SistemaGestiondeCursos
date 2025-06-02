package com.sistema.service;

import com.sistema.modelo.*;
import com.sistema.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotaService {

    @Autowired
    private NotaRepository notaRepo;

    public List<Nota> listarNotas() {
        return notaRepo.findAll();
    }

    public Nota guardarNota(Nota nota) {
        return notaRepo.save(nota);
    }

    public List<Nota> buscarPorEstudiante(Estudiante e) {
        return notaRepo.findByEstudiante(e);
    }

    public List<Nota> buscarPorCurso(Curso c) {
        return notaRepo.findByCurso(c);
    }

    public Nota buscarPorEstudianteYCurso(Estudiante e, Curso c) {
        return notaRepo.findByEstudianteAndCurso(e, c);
    }

    public void eliminarNota(Long id) {
        notaRepo.deleteById(id);
    }
}
