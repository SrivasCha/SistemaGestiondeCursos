package com.sistema.security;

import com.sistema.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Asegura que @PreAuthorize funcione
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(customizer -> customizer.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Rutas que no requieren autenticación
                .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Para pre-vuelos CORS
                .requestMatchers("/uploads/**").permitAll() // ✅ Permitir acceso a archivos subidos (ej. fotos de perfil)

                // ✅ Rutas específicas para el Panel de Estudiante (accede a SU PROPIA información)
                // Usamos el prefijo /api/estudiante/ para todo lo relacionado con el panel del estudiante logueado
                .requestMatchers("/api/estudiante/**").hasRole("ESTUDIANTE")
                
                // ✅ Rutas de administración para gestionar estudiantes (accede a información de TODOS los estudiantes)
                // Estas rutas serán para el rol ADMIN. Las específicas de ESTUDIANTE del bloque anterior ya no son necesarias aquí si se consolidan.
                .requestMatchers("/api/estudiantes/**").hasRole("ADMIN") 

                // Rutas de administración general
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Rutas para profesores
                .requestMatchers("/api/profesor/**").hasRole("PROFESOR")
                
                // Rutas de notas: permitidas para Estudiantes, Admin y Profesores
                // Si /api/notas/mis-notas es solo para ESTUDIANTE, ya está cubierta por /api/estudiante/** si está dentro de ese prefijo.
                // Si /api/notas/estudiante es para ver notas de UN estudiante por ADMIN/PROFESOR, debe ser más específica o consolidarse.
                // Para simplificar, si /api/notas/** es para múltiples roles:
                .requestMatchers("/api/notas/**").hasAnyRole("ESTUDIANTE", "ADMIN", "PROFESOR")

                // Configuración para cursos (ajusta si tus APIs son diferentes)
                .requestMatchers(HttpMethod.GET, "/api/curso/**").permitAll() // Cualquiera puede ver cursos
                .requestMatchers(HttpMethod.POST, "/api/curso").hasAnyRole("ADMIN", "PROFESOR") // Crear cursos
                .requestMatchers(HttpMethod.PUT, "/api/curso/**").hasAnyRole("ADMIN", "PROFESOR") // Actualizar cursos
                .requestMatchers(HttpMethod.DELETE, "/api/curso/**").hasAnyRole("ADMIN", "PROFESOR") // Eliminar cursos
                
                // Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Asegúrate que esta URL sea la de tu frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}