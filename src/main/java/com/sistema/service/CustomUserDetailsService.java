package com.sistema.service;

import com.sistema.modelo.Usuario;
import com.sistema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Importar esta clase
import org.springframework.stereotype.Service;
import java.util.Collections; // Usar para crear una lista inmutable de una sola autoridad

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // ✅ Lógica corregida para construir las autoridades
        // Asumiendo que usuario.getRol() devuelve directamente el String del rol (ej. "ADMIN", "ESTUDIANTE")
        return new org.springframework.security.core.userdetails.User(
            usuario.getEmail(),
            usuario.getPassword(),
            // Crear una lista de SimpleGrantedAuthority.
            // Spring Security espera objetos que implementen GrantedAuthority.
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol()))
        );
    }
}