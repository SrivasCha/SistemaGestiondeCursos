-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.40 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para sistema_gestion_cursos
CREATE DATABASE IF NOT EXISTS `sistema_gestion_cursos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_gestion_cursos`;

-- Volcando estructura para tabla sistema_gestion_cursos.asistencias
CREATE TABLE IF NOT EXISTS `asistencias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `presente` bit(1) NOT NULL,
  `curso_id` bigint NOT NULL,
  `estudiante_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqe8prx2o8fr4qylhqgakdtvia` (`curso_id`),
  KEY `FKnfgv8rclc5owrtp37vj00s9vw` (`estudiante_id`),
  CONSTRAINT `FKnfgv8rclc5owrtp37vj00s9vw` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `FKqe8prx2o8fr4qylhqgakdtvia` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.asistencias: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_gestion_cursos.cursos
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `duracion` int NOT NULL,
  `horario` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profesor_id` bigint DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6sw8s0sluxsy2mbwu9yk9ko2g` (`profesor_id`),
  CONSTRAINT `FK6sw8s0sluxsy2mbwu9yk9ko2g` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.cursos: ~4 rows (aproximadamente)

-- Volcando estructura para tabla sistema_gestion_cursos.estudiantes
CREATE TABLE IF NOT EXISTS `estudiantes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apellido` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `fotoPerfil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numeroIdentificacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKks74get5br3cnt3bugfama4b4` (`email`),
  UNIQUE KEY `UKfje3n18j10lxwrl73c0tjg6gx` (`usuario_id`),
  UNIQUE KEY `UK77da6n058qow5ss7nl0vetsns` (`numeroIdentificacion`),
  CONSTRAINT `FKb0dbyyelxi4ns7aekhbhqb7t7` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.estudiantes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_gestion_cursos.estudiante_curso
CREATE TABLE IF NOT EXISTS `estudiante_curso` (
  `estudiante_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  PRIMARY KEY (`estudiante_id`,`curso_id`),
  KEY `FK6tqel8dbqun880ifh66lvnxto` (`curso_id`),
  CONSTRAINT `FK6tqel8dbqun880ifh66lvnxto` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`),
  CONSTRAINT `FKhfuotltc86n0tq06n3bbpyw0j` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.estudiante_curso: ~7 rows (aproximadamente)

-- Volcando estructura para tabla sistema_gestion_cursos.notas
CREATE TABLE IF NOT EXISTS `notas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `calificacion` double NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaRegistro` datetime(6) NOT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `curso_id` bigint DEFAULT NULL,
  `estudiante_id` bigint DEFAULT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `profesor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiglkniyt6ishuvd3xlgu7la8o` (`curso_id`),
  KEY `FKg586l63sb3khyyqjuw3p345g1` (`estudiante_id`),
  KEY `FK4753mietrr6ryleu0jd00tnwq` (`profesor_id`),
  CONSTRAINT `FK4753mietrr6ryleu0jd00tnwq` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`id`),
  CONSTRAINT `FKg586l63sb3khyyqjuw3p345g1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `FKiglkniyt6ishuvd3xlgu7la8o` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.notas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla sistema_gestion_cursos.profesores
CREATE TABLE IF NOT EXISTS `profesores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `especialidad` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoctb60ms5utlc2tdri56w2b9g` (`usuario_id`),
  CONSTRAINT `FKg5lq3i5xjb46eh8ifq20j1gq5` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.profesores: ~1 rows (aproximadamente)

-- Volcando estructura para tabla sistema_gestion_cursos.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol` enum('ADMIN','ESTUDIANTE','PROFESOR') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4tdehxj7dh8ghfc68kbwbsbll` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_gestion_cursos.usuario: ~8 rows (aproximadamente)
INSERT INTO `usuario` (`id`, `email`, `nombre`, `password`, `rol`) VALUES
	(1, 'no@no.com', 'Admin Test', '$2a$10$xi3j8OTmrz3djpWp.wcJrOf59jo8TFyaEZ4trkgHzNm8/t6kKbNGi', 'ADMIN');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
