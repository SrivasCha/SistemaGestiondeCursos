# 📚 Sistema de Gestión de Cursos y Notas

[![GitHub last commit](https://img.shields.io/github/last-commit/ByteNexOfi/SistemaGestiondeCursos)](https://github.com/ByteNexOfi/SistemaGestiondeCursos)
[![GitHub issues](https://img.shields.io/github/issues/ByteNexOfi/SistemaGestiondeCursos)](https://github.com/ByteNexOfi/SistemaGestiondeCursos/issues)
[![GitHub forks](https://img.shields.io/github/forks/ByteNexOfi/SistemaGestiondeCursos)](https://github.com/ByteNexOfi/SistemaGestiondeCursos/network/members)
[![GitHub stars](https://img.shields.io/github/stars/ByteNexOfi/SistemaGestiondeCursos)](https://github.com/ByteNexOfi/SistemaGestiondeCursos/stargazers)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📝 Descripción General del Proyecto

Este proyecto es un sistema integral diseñado para la gestión académica de cursos, estudiantes, profesores, notas y asistencia en una institución educativa. Su objetivo principal es optimizar las operaciones diarias, permitiendo a los administradores supervisar la información del sistema, a los profesores registrar y gestionar el progreso académico de los estudiantes, y a los estudiantes consultar sus calificaciones y asistencia.

El sistema se estructura en dos componentes principales interconectados:

* **Backend (API RESTful):** Desarrollado con **Spring Boot**, que expone un conjunto de endpoints RESTful para la gestión de datos.
* **Frontend (Aplicación Web):** Construida con **React.js**, proporcionando una interfaz de usuario intuitiva y dinámica para interactuar con la API del backend.

## ✨ Características Clave

El sistema ofrece las siguientes funcionalidades destacadas:

* **Gestión de Usuarios:**
    * Roles diferenciados para **ADMIN**, **PROFESOR** y **ESTUDIANTE**.
    * Autenticación segura basada en **JWT (JSON Web Tokens)**.
* **Gestión de Cursos:**
    * Operaciones **CRUD** (Crear, Leer, Actualizar, Eliminar) para cursos.
    * Asignación de profesores a cursos.
* **Gestión de Estudiantes:**
    * Registro y administración completa de la información del estudiante.
    * Inscripción de estudiantes a cursos específicos.
* **Gestión de Profesores:**
    * Registro y gestión de los datos de los profesores.
* **Gestión de Notas:**
    * **Profesores:** Capacidad para registrar, visualizar, editar y eliminar notas para sus estudiantes en los cursos que imparten.
    * **Estudiantes:** Acceso para consultar sus propias calificaciones académicas.
* **Gestión de Asistencia:**
    * **Profesores:** Funcionalidad para registrar y consultar la asistencia de los estudiantes por curso y fecha.
* **Base de Datos:**
    * Persistencia de datos mediante **MySQL**.

## 🚀 Tecnologías Utilizadas

### Backend

* **Spring Boot**: Framework líder para el desarrollo rápido de aplicaciones Java.
* **Spring Data JPA**: Simplifica el acceso a datos y la interacción con la base de datos.
* **Hibernate**: Implementación de JPA para mapeo objeto-relacional.
* **Spring Security**: Proporciona robustas funcionalidades de autenticación (JWT) y autorización (basada en roles).
* **Lombok**: Herramienta que reduce el código `boilerplate` en los modelos Java (getters, setters, constructores, etc.).
* **MySQL Connector/J**: Driver JDBC oficial para la conexión con MySQL.
* **Maven**: Herramienta poderosa para la gestión de dependencias y el ciclo de vida de construcción del proyecto.

### Frontend

* **React.js**: Biblioteca JavaScript declarativa para construir interfaces de usuario eficientes.
* **Vite**: Herramienta de construcción de última generación que ofrece una experiencia de desarrollo frontend extremadamente rápida.
* **React Router DOM**: Biblioteca estándar para el enrutamiento declarativo en aplicaciones React.
* **React Bootstrap**: Implementación de componentes de Bootstrap para React, facilitando un diseño responsivo y atractivo.
* **Axios**: Cliente HTTP basado en promesas para realizar peticiones al backend.
* **date-fns**: Una librería moderna de utilidades para la manipulación y formateo de fechas.
* **React Toastify**: Componente fácil de usar para mostrar notificaciones (toasts) personalizables.
* **Font Awesome**: Conjunto popular de iconos vectoriales escalables.

## 📁 Estructura del Proyecto

La estructura del proyecto se organiza de la siguiente manera:

sistema-gestion-cursos/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── sistema/
│   │   │   │           ├── config/           # ⚙️ Configuración de seguridad (Spring Security, JWT)
│   │   │   │           ├── controller/       # 🌐 Controladores REST (ProfesorController, NotaController, etc.)
│   │   │   │           ├── modelo/           # 📦 Entidades JPA (Curso, Estudiante, Nota, Profesor, Asistencia, Usuario)
│   │   │   │           ├── repository/       # 💾 Interfaces Spring Data JPA para acceso a datos
│   │   │   │           └── service/          # 🧩 Lógica de negocio (servicios)
│   │   │   └── resources/        # 📄 Archivos de configuración (application.properties)
│   │   └── test/                 # 🧪 Pruebas unitarias y de integración
│   └── pom.xml                   # 📝 Configuración Maven
├── frontend/
│   ├── public/                   # 🖼️ Archivos estáticos
│   ├── src/
│   │   ├── assets/               # 📂 Recursos estáticos (imágenes, iconos, etc.)
│   │   ├── components/           # ⚛️ Componentes React (PanelProfesor.jsx, Login.jsx, etc.)
│   │   ├── services/             # 📞 Servicios de API (api.js, authService.js)
│   │   ├── styles/               # 🎨 Archivos CSS personalizados
│   │   ├── App.jsx               # 🚀 Componente principal de la aplicación
│   │   └── main.jsx              # ⚡ Punto de entrada de React (Vite)
│   ├── index.html                # 📄 Archivo HTML principal
│   └── package.json              # 📋 Configuración de dependencias npm/yarn
├── README.md                     # 📖 ¡Este archivo!
└── BD_Sistema-cursos.sql         # 🐘 Script de la base de datos MySQL


## 🛠️ Requisitos Previos

Antes de configurar y ejecutar el proyecto, asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

* **Java Development Kit (JDK) 17 o superior:** Necesario para compilar y ejecutar el backend de Spring Boot.
* **Apache Maven 3.x:** Herramienta para la gestión de dependencias y la construcción del proyecto backend.
* **Node.js (versión LTS) y npm/yarn:** Esenciales para ejecutar el frontend de React.js y gestionar sus dependencias.
* **MySQL Server 8.x:** La base de datos relacional utilizada para la persistencia de datos del sistema.
* **Un IDE (Entorno de Desarrollo Integrado):** Opcional, pero altamente recomendado para una mejor experiencia de desarrollo. **VS Code** es una excelente opción.

## ⚙️ Configuración y Ejecución del Proyecto

Sigue estos pasos para poner en marcha el sistema en tu máquina local:

### 1. Configuración de la Base de Datos

a.  **Iniciar MySQL Server:**
    Asegúrate de que tu servidor MySQL esté en ejecución.

b.  **Crear la Base de Datos y Tablas:**
    Abre tu cliente MySQL preferido (MySQL Workbench, línea de comandos, DBeaver, etc.) y ejecuta el script `BD_Sistema-cursos.sql` para crear la base de datos `sistema_gestion_cursos` y todas sus tablas necesarias.

    ```sql
    -- En tu cliente MySQL o terminal, navega a la ruta del archivo y ejecuta:
    SOURCE ruta/absoluta/a/BD_Sistema-cursos.sql;
    ```
    *Asegúrate de que el script crea la base de datos `sistema_gestion_cursos` y las tablas `cursos`, `estudiantes`, `notas`, `profesores`, `usuario`, `estudiante_curso`, y `asistencias`.*

    **Credenciales de Acceso por Defecto:**
    * **Usuario Administrador:** `no@no.com`
    * **Contraseña:** `1`

### 2. Configuración y Ejecución del Backend

a.  **Clonar el Repositorio:**
    Si aún no lo has hecho, clona el repositorio del proyecto y navega al directorio del backend:

    ```bash
    git clone [https://github.com/ByteNexOfi/SistemaGestiondeCursos.git](https://github.com/ByteNexOfi/SistemaGestiondeCursos.git)
    cd sistema-gestion-cursos/backend
    ```

b.  **Configurar `application.properties`:**
    * Navega a `backend/src/main/resources/`.
    * Abre el archivo `application.properties`.
    * Verifica y ajusta las propiedades de conexión a la base de datos para que coincidan con tu configuración de MySQL. Además, asegúrate de que la clave JWT sea **fuerte y única**:

        ```properties
        spring.datasource.url=jdbc:mysql://localhost:3306/sistema_gestion_cursos?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
        spring.datasource.username=root
        spring.datasource.password=your_mysql_password_here # ¡CAMBIA ESTO!
        spring.jpa.hibernate.ddl-auto=update # o none si prefieres manejar las migraciones manualmente
        spring.jpa.show-sql=true
        spring.jpa.properties.hibernate.format_sql=true

        # JWT Configuration
        jwt.secret=UnaClaveSecretaMuyLargaYSeguraParaJWTQueDebeTenerAlMenos32CaracteresParaHS256 # ¡CAMBIA ESTO POR UNA CLAVE SEGURA!
        jwt.expiration=86400000 # 24 horas en milisegundos

        # Allow Cross-Origin Requests (CORS) - IMPORTANTE para la comunicación con el frontend
        spring.mvc.cors.enabled=true
        cors.allowedOrigins=http://localhost:5173 # O la URL de tu frontend React
        cors.allowedMethods=GET,POST,PUT,DELETE,OPTIONS
        cors.allowedHeaders=*
        cors.allowCredentials=true
        ```
        **⚠️ Importante:**
        * Reemplaza `your_mysql_password_here` con la contraseña de tu usuario `root` de MySQL o del usuario que hayas configurado.
        * Reemplaza `UnaClaveSecretaMuyLargaYSeguraParaJWTQueDebeTenerAlMenos32CaracteresParaHS256` con una clave secreta fuerte y única.

c.  **Construir el Proyecto Maven:**
    * Desde la terminal en el directorio `sistema-gestion-cursos/backend`, ejecuta el siguiente comando para construir el proyecto y descargar las dependencias:
        ```bash
        mvn clean install
        ```

d.  **Ejecutar la Aplicación Spring Boot:**
    * Desde la misma terminal, inicia la aplicación Spring Boot:
        ```bash
        mvn spring-boot:run
        ```
    * El backend debería iniciarse y ser accesible en `http://localhost:8080`.

### 3. Configuración y Ejecución del Frontend

a.  **Navegar al Directorio del Frontend:**
    ```bash
    cd ../frontend
    ```

b.  **Instalar Dependencias:**
    * Desde la terminal en el directorio `sistema-gestion-cursos/frontend`, instala las dependencias de Node.js:
        ```bash
        npm install
        # O si prefieres yarn:
        # yarn install
        ```

c.  **Verificar la Configuración de la API:**
    * Abre el archivo `frontend/src/services/api.js`.
    * Asegúrate de que `baseURL` apunte a la URL de tu backend de Spring Boot (por defecto `http://localhost:8080`).

    ```javascript
    // src/services/api.js
    import axios from 'axios';
    import { getToken } from './authService';

    const api = axios.create({
        baseURL: 'http://localhost:8080', // Asegúrate de que esto coincida con la URL de tu backend
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // ... (resto del interceptor de Axios si existe)
    ```

d.  **Ejecutar la Aplicación React:**
    * Desde la misma terminal, ejecuta:
        ```bash
        npm run dev
        # O si prefieres yarn:
        # yarn dev
        ```
    * El frontend debería abrirse automáticamente en tu navegador predeterminado (generalmente `http://localhost:5173`).

## 👨‍💻 Uso del Sistema

1.  **Registro / Inicio de Sesión:**
    * Si no tienes usuarios, puedes registrarlos a través de los endpoints de tu backend (si están expuestos públicamente) o insertarlos directamente en la tabla `usuario` de tu base de datos (asegurándote de encriptar las contraseñas). Recuerda que el usuario admin por defecto es `no@no.com` con contraseña `123456`.
    * Inicia sesión utilizando un usuario con el rol `PROFESOR` o `ADMIN` para acceder a las funcionalidades completas.

2.  **Navegación:**
    * Después de un inicio de sesión exitoso, los profesores serán redirigidos al `PanelProfesor`, que es el punto central para sus actividades.

3.  **Gestión de Cursos:**
    * En el `PanelProfesor`, podrás visualizar los cursos que han sido asignados a ese profesor.
    * Desde la lista de cursos, haz clic en "Ver Estudiantes" para acceder a la lista de estudiantes inscritos en un curso particular.

4.  **Gestión de Notas:**
    * Dentro de la vista de estudiantes de un curso, selecciona un estudiante y haz clic en "Gestionar Notas".
    * Podrás agregar nuevas calificaciones, así como editar o eliminar las notas existentes para ese estudiante.

5.  **Gestión de Asistencia:**
    * Desde la tabla de cursos, selecciona un curso y haz clic en "Tomar Asistencia".
    * Elige la fecha actual y registra la asistencia de cada estudiante (presente/ausente) para ese curso y día.

## 🚧 Consideraciones de Desarrollo y Mantenimiento

* **Manejo de Errores:** Aunque se ha implementado un manejo básico de errores en el frontend con `react-toastify`, considera expandirlo para ofrecer una experiencia de usuario más robusta y mensajes de error detallados.
* **Validación de Datos:** Es crucial añadir validaciones más exhaustivas tanto en el frontend (para feedback instantáneo al usuario) como, especialmente, en el backend (para garantizar la integridad y seguridad de los datos).
* **Seguridad:** La configuración de Spring Security con JWT es vital. Asegúrate de que tu `jwt.secret` sea una cadena de texto muy compleja y que nunca se exponga en entornos de producción.
* **Variables de Entorno:** Para un despliegue en producción, es una buena práctica mover las credenciales sensibles de la base de datos y la clave JWT a variables de entorno, en lugar de dejarlas directamente en `application.properties` o en el código fuente.
* **Despliegue:** Para llevar el proyecto a un entorno de producción, necesitarás un servidor de aplicaciones para el JAR ejecutable de Spring Boot (ej. Docker, un VPS) y un servidor web para servir la aplicación React (ej. Nginx, Apache, o plataformas como Netlify/Vercel para el frontend estático).

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1.  Haz un "fork" del repositorio.
2.  Crea una nueva rama para tu característica (`git checkout -b feature/nombre-de-la-caracteristica`).
3.  Realiza tus cambios y asegúrate de que las pruebas pasen.
4.  Haz "commit" de tus cambios (`git commit -m 'feat: Añadir nueva característica X'`).
5.  Sube tu rama (`git push origin feature/nombre-de-la-caracteristica`).
6.  Abre un "Pull Request" a la rama `main` de este repositorio.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---