package com.sistema.service;

import com.sistema.modelo.Estudiante;
import com.sistema.modelo.Profesor;
import com.sistema.modelo.Rol;
import com.sistema.modelo.Usuario;
import com.sistema.repository.EstudianteRepository;
import com.sistema.repository.ProfesorRepository;
import com.sistema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private ProfesorRepository profesorRepository; // Inyectar el nuevo repositorio

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional // Asegura que ambas operaciones (guardar Usuario y Perfil) sean atómicas
    public Usuario registrarNuevoUsuarioYPerfil(Usuario usuario) {
        // 1. Encriptar la contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 2. Guardar el Usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // 3. Crear el perfil correspondiente según el rol
        if (usuario.getRol() == Rol.ESTUDIANTE) {
            Estudiante estudiante = new Estudiante(
                usuario.getNombre(),
                "ApellidoPorDefecto", // Puedes pedir el apellido en el registro o dejarlo por defecto
                usuario.getEmail(),
                usuarioGuardado
            );
            estudianteRepository.save(estudiante);
        } /*else if (usuario.getRol() == Rol.PROFESOR) { -----------Comentado momentaneamente, se puede descomentar si se implementa el perfil de Profesor
            Profesor profesor = new Profesor(
                usuario.getNombre(),
                "ApellidoPorDefecto", // Igual aquí
                usuario.getEmail(),
                "EspecialidadPorDefecto", // O pedirla
                usuarioGuardado
            );
            profesorRepository.save(profesor);
        }*/
        // Para ADMIN, no necesitas crear un perfil adicional en otra tabla si el rol es suficiente

        return usuarioGuardado;
    }

    // Puedes añadir otros métodos relacionados con la gestión de usuarios aquí
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }
}