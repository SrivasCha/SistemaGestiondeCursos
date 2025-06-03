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
@EnableMethodSecurity(prePostEnabled = true)
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
                // ✅ ORDEN CRÍTICO: Las rutas más específicas SIEMPRE van primero
                
                // 1. Rutas públicas de autenticación
                .requestMatchers("/api/auth/**").permitAll()
                
                // 2. ⭐ CRÍTICO: Registro solo para ADMIN - DEBE ir antes de /api/admin/**
                .requestMatchers(HttpMethod.POST, "/api/auth/register").hasRole("ADMIN")
                
                // 3. Otras rutas específicas de auth (si existen)
                .requestMatchers("/api/auth/**").permitAll() // Solo si tienes otras rutas públicas
                
                // 4. Pre-vuelos CORS (muy importante para frontend)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // 5. Consola H2 para desarrollo (eliminar en producción)
                .requestMatchers("/h2-console/**").permitAll()
                
                // 6. Archivos estáticos
                .requestMatchers("/uploads/**").permitAll()

                // 7. ⭐ Rutas específicas por rol - MÁS ESPECÍFICAS PRIMERO
                
                // Panel de estudiante (rutas específicas)
                .requestMatchers("/api/estudiante/**").hasRole("ESTUDIANTE")
                
                // Gestión de estudiantes (ADMIN)
                .requestMatchers("/api/estudiantes/**").hasRole("ADMIN") 
                
                // Panel de administración
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Panel de profesores
                .requestMatchers("/api/profesor/**").hasRole("PROFESOR")
                
                // 8. Rutas de notas (múltiples roles)
                .requestMatchers("/api/notas/**").hasAnyRole("ESTUDIANTE", "ADMIN", "PROFESOR")

                // 9. Rutas de cursos por método HTTP
                .requestMatchers(HttpMethod.GET, "/api/curso/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/curso/**").hasAnyRole("ADMIN", "PROFESOR")
                .requestMatchers(HttpMethod.PUT, "/api/curso/**").hasAnyRole("ADMIN", "PROFESOR")
                .requestMatchers(HttpMethod.DELETE, "/api/curso/**").hasAnyRole("ADMIN", "PROFESOR")
                
                // 10. Cualquier otra petición requiere autenticación
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
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
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