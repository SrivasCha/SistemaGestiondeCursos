package com.sistema.controller;

import com.sistema.modelo.*;
import com.sistema.service.JwtService;
import com.sistema.service.UsuarioService; // Importar el nuevo servicio
import com.sistema.repository.UsuarioRepository; // Mantenemos por si acaso, pero UsuarioService ya lo usa
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder; // Ya no lo usaremos directamente en registrar
import org.springframework.web.bind.annotation.*;
import java.util.List; // Necesario si usas List.of en CorsConfigurationSource (aunque no aquí directamente)


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // <--- Recomendado especificar el origen para seguridad CORS
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepo; // Mantenemos por si acaso, pero UsuarioService ya lo usa

    // @Autowired // <--- Ya no inyectamos PasswordEncoder aquí, el UsuarioService lo maneja
    // private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioService usuarioService; // <--- ¡Inyectar el nuevo servicio!

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Obtener el usuario después de la autenticación exitosa
        Usuario usuario = usuarioRepo.findByEmail(request.getEmail())
                                     .orElseThrow(() -> new BadCredentialsException("Usuario o contraseña incorrectos"));

        // Generar el token JWT
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol().name());

        return new LoginResponse(token, usuario.getRol().name());
    }

        @PostMapping("/register")
        public Usuario registrar(@RequestBody Usuario usuario) {
            System.out.println("DEBUG: Recibida petición de registro para: " + usuario.getEmail());
            System.out.println("DEBUG: Rol a asignar: " + usuario.getRol());
            
            return usuarioService.registrarNuevoUsuarioYPerfil(usuario);
        }
}