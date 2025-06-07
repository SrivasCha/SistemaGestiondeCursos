Sistema de Gestión de Cursos y Notas
Descripción General del Proyecto
Este proyecto es un sistema integral para la gestión de cursos, estudiantes, profesores, notas y asistencia. Está diseñado para facilitar las operaciones académicas dentro de una institución educativa, permitiendo a los administradores gestionar la información del sistema, a los profesores registrar notas y asistencia, y a los estudiantes consultar su progreso académico.

El sistema se compone de dos partes principales:

Backend (API RESTful): Desarrollado con Spring Boot, expone endpoints para la gestión de datos.
Frontend (Aplicación Web): Desarrollada con React.js, proporciona una interfaz de usuario intuitiva para interactuar con el backend.
Características Clave
Gestión de Usuarios: Roles diferenciados (ADMIN, PROFESOR, ESTUDIANTE) con autenticación basada en JWT.
Gestión de Cursos: Creación, lectura, actualización y eliminación (CRUD) de cursos. Asignación de profesores a cursos.
Gestión de Estudiantes: Registro y gestión de información de estudiantes. Inscripción de estudiantes a cursos.
Gestión de Profesores: Registro y gestión de información de profesores.
Gestión de Notas:
Los profesores pueden registrar, ver, editar y eliminar notas para sus estudiantes en los cursos que imparten.
Los estudiantes pueden consultar sus propias notas.
Gestión de Asistencia:
Los profesores pueden registrar y consultar la asistencia de los estudiantes por curso y fecha.
Base de Datos: MySQL para persistencia de datos.
Tecnologías Utilizadas
Backend
Spring Boot: Framework para el desarrollo de aplicaciones Java.
Spring Data JPA: Para la persistencia de datos y la interacción con la base de datos.
Hibernate: Implementación de JPA.
Spring Security: Para autenticación (JWT) y autorización (roles).
Lombok: Para reducir código boilerplate en los modelos (getters, setters, constructores, etc.).
Conector MySQL/J: Controlador JDBC para MySQL.
Maven: Herramienta de gestión de dependencias y construcción de proyectos.
Interfaz
React.js: Biblioteca JavaScript para construir interfaces de usuario.
Vite: Herramienta de construcción de proyectos frontend (usado para un desarrollo rápido).
React Router DOM: Para la navegación y el enrutamiento en la aplicación.
React Bootstrap: Componentes de interfaz de usuario basados en Bootstrap.
Axios: Cliente HTTP para realizar peticiones al backend.
date-fns: Utilidad para manipulación y formateo de fechas.
React Toastify: Para mostrar notificaciones (toasts) al usuario.
Font Awesome: Iconos.
Estructura del Proyecto
sistema-gestion-cursos/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── sistema/
│   │   │   │           ├── config/           # Configuración de seguridad (Spring Security, JWT)
│   │   │   │           ├── controller/       # Controladores REST (ProfesorController, NotaController, etc.)
│   │   │   │           ├── modelo/           # Entidades JPA (Curso, Estudiante, Nota, Profesor, Asistencia, Usuario)
│   │   │   │           ├── repository/       # Interfaces Spring Data JPA para acceso a datos
│   │   │   │           └── service/          # Lógica de negocio (servicios)
│   │   │   └── resources/        # Archivos de configuración (application.properties)
│   │   └── test/
│   └── pom.xml                   # Configuración Maven
├── frontend/
│   ├── public/                   # Archivos estáticos
│   ├── src/
│   │   ├── assets/               # Recursos estáticos (imágenes, iconos, etc.)
│   │   ├── components/           # Componentes React (PanelProfesor.jsx, Login.jsx, etc.)
│   │   ├── services/             # Servicios de API (api.js, authService.js)
│   │   ├── styles/               # Archivos CSS personalizados
│   │   ├── App.jsx               # Componente principal de la aplicación
│   │   └── main.jsx              # Punto de entrada de React
│   ├── index.html
│   └── package.json              # Configuración de dependencias npm/yarn
└── README.md                     # ¡Este archivo!
└── BD_Sistema-cursos.sql         # Script de la base de datos MySQL
Requisitos Previos
Antes de configurar y ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

Java Development Kit (JDK) 17 o superior: Para ejecutar el backend de Spring Boot.
Apache Maven 3.x: Para construir el proyecto backend.
Node.js (LTS) y npm/yarn: Para ejecutar el frontend de React.js.
MySQL Server 8.x: Para la base de datos.
Un IDE: (Opcional, pero recomendado) VS Code.
Configuración y Ejecución del Proyecto
Sigue estos pasos para poner en marcha el sistema:

1. Configuración de la Base de Datos
a.  Iniciar MySQL Server: Asegúrate de que tu servidor MySQL esté en ejecución.
b.  Crear la Base de Datos: Abre tu cliente MySQL (MySQL Workbench, línea de comandos, etc.) y ejecuta el script BD_Sistema-cursos.sql para crear la base de datos y sus tablas.
sql -- Dentro de tu cliente MySQL, ejecuta este script: SOURCE ruta/a/BD_Sistema-cursos.sql;
Asegúrate de que el script crea la base de datos sistema_gestion_cursos y las tablas cursos, estudiantes, notas, profesores, usuario, estudiante_curso, y asistencias (si ya seguiste la guía de adición de asistencia).
El usuario admin por defecto es 'no@no.com' pass: '123456'.

1. Configuración y Ejecución del Backend
a.  Clonar el Repositorio (si aún no lo has hecho):
bash git clone https://github.com/ByteNexOfi/SistemaGestiondeCursos.git cd sistema-gestion-cursos/backend
b.  Configurar application.properties:
* Navega a backend/src/main/resources/.
* Abre el archivo application.properties.
* Asegúrate de que las propiedades de conexión a la base de datos coincidan con tu configuración de MySQL:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/sistema_gestion_cursos?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=your_mysql_password
    spring.jpa.hibernate.ddl-auto=update # o none si prefieres manejar las migraciones manualmente
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.format_sql=true

    # JWT Configuration (Example, adjust as needed)
    jwt.secret=TuClaveSecretaMuyLargaYSeguraParaJWTQueDebeTenerAlMenos32CaracteresParaHS256
    jwt.expiration=86400000 # 24 horas en milisegundos

    # Allow Cross-Origin Requests (CORS) - IMPORTANT for frontend
    spring.mvc.cors.enabled=true
    cors.allowedOrigins=http://localhost:5173 # O la URL de tu frontend React
    cors.allowedMethods=GET,POST,PUT,DELETE,OPTIONS
    cors.allowedHeaders=*
    cors.allowCredentials=true
    ```
    **Importante:** Cambia `your_mysql_password` a la contraseña de tu usuario `root` de MySQL o al usuario que hayas configurado. Reemplaza `TuClaveSecretaMuyLargaYSeguraParaJWTQueDebeTenerAlMenos32CaracteresParaHS256` con una clave secreta fuerte y única.
c.  Construir el Proyecto Maven:
* Abre una terminal en el directorio sistema-gestion-cursos/backend.
* Ejecuta el siguiente comando para construir el proyecto y descargar las dependencias:
bash mvn clean install
d.  Ejecutar la Aplicación Spring Boot:
* Desde la misma terminal, ejecuta:
bash mvn spring-boot:run
* El backend debería iniciarse en http://localhost:8080.

1. Configuración y Ejecución del Frontend
a.  Navegar al Directorio del Frontend:
bash cd ../frontend
b.  Instalar Dependencias:
* Abre una terminal en el directorio sistema-gestion-cursos/frontend.
* Instala las dependencias de Node.js:
bash npm install # O yarn install
c.  Verificar la Configuración de la API:
* Abre el archivo frontend/src/services/api.js.
* Asegúrate de que baseURL apunte a la URL de tu backend de Spring Boot (por defecto http://localhost:8080).
```javascript
// src/services/api.js
import axios from 'axios';
import { getToken } from './authService';

    const api = axios.create({
        baseURL: 'http://localhost:8080', // Asegúrate de que esto coincida con tu backend
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // ... (resto del interceptor)
    ```
d.  Ejecutar la Aplicación React:
* Desde la misma terminal, ejecuta:
bash npm start # O yarn dev # Si usas Vite, el comando para desarrollo suele ser `dev`
* El frontend debería abrirse en tu navegador predeterminado (normalmente http://localhost:5173).

Uso del Sistema
Registro/Inicio de sesión:
Si no tienes usuarios, puedes registrarlos a través de los endpoints de tu backend (si los tienes expuestos) o insertarlos directamente en la tabla usuario de tu base de datos (asegurándote de encriptar las contraseñas).
Inicia sesión con un usuario que tenga el rol de PROFESOR o ADMIN.
Navegación:
Después de iniciar sesión, los profesores serán redirigidos al PanelProfesor.
Gestión de Cursos:
En el PanelProfesor, podrás ver los cursos asignados al profesor.
Desde allí, puedes "Ver Estudiantes" para un curso específico.
Gestión de Notas:
Dentro de la vista de estudiantes de un curso, haz clic en "Gestionar Notas" para un estudiante.
Podrás agregar nuevas notas, editar las existentes o eliminarlas.
Gestión de Asistencia:
Desde la tabla de cursos, haz clic en "Tomar Asistencia" para un curso.
Selecciona la fecha y marca la asistencia de cada estudiante.
Consideraciones de Desarrollo y Mantenimiento
Manejo de Errores: Se ha implementado un manejo básico de errores en el frontend con react-toastify. Considera implementar un manejo de errores más robusto y mensajes detallados para el usuario.
Validación: Se recomienda añadir más validaciones tanto en el frontend (para feedback inmediato al usuario) como en el backend (para asegurar la integridad de los datos).
Seguridad: La configuración de Spring Security con JWT es fundamental. Asegúrate de que tu jwt.secret sea complejo y no esté expuesto públicamente.
Variables de Entorno: Para producción, es buena práctica mover las credenciales de la base de datos y la clave JWT a variables de entorno para una mayor seguridad.
Despliegue: Para desplegar el proyecto, necesitarás un servidor de aplicaciones para Spring Boot (como un JAR ejecutable o un contenedor Docker) y un servidor web para React (como Nginx o un servicio de hosting como Netlify/Vercel).