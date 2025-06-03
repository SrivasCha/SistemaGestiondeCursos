package com.sistema.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permitir todos los endpoints
                .allowedOrigins("http://localhost:5173") // Solo tu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Necesario si usás cookies o tokens
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Habilita acceso a imágenes desde http://localhost:8080/uploads/archivo.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
