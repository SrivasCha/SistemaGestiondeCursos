package com.sistema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BackendApplication {

    private static final Logger logger = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        logger.info("Iniciando la aplicación...");
        SpringApplication.run(BackendApplication.class, args);
        logger.info("Aplicación iniciada correctamente en http://localhost:8080/");
    }
}
