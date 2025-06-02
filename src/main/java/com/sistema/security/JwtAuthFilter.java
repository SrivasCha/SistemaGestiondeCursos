package com.sistema.security;

import com.sistema.service.JwtService;
import com.sistema.service.CustomUserDetailsService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ApplicationContext applicationContext; // se inyecta solo el contexto

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtService.validateToken(token)) {
                String email = jwtService.extractEmail(token);

                // Obtiene CustomUserDetailsService en tiempo de ejecución para evitar el ciclo
                CustomUserDetailsService userDetailsService = applicationContext.getBean(CustomUserDetailsService.class);

                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("DEBUG: Usuario autenticado en SecurityContext. Roles: " + userDetails.getAuthorities()); // Añade este log
            } else {
                System.out.println("DEBUG: Token inválido o expirado."); // Añade este log
            }
        } else {
            System.out.println("DEBUG: No hay token en el encabezado Authorization o no es un token Bearer."); // Añade este log
        }
        filterChain.doFilter(request, response);
    }

    // Añade este método para ignorar el filtro en rutas de autenticación
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Ignora el filtro JWT para las rutas de autenticación
        return request.getServletPath().startsWith("/api/auth");
    }
}