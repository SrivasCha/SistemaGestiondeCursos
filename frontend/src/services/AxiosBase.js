import axios from 'axios';

// Asegúrate de que este puerto coincida con el puerto de tu backend Spring Boot (ej. 8080)
const BASE_URL = 'http://localhost:8080/api/'; 

// Crear una instancia de Axios con la configuración base
const api = axios.create({
    baseURL: BASE_URL,
    // Puedes añadir headers comunes aquí, como el Content-Type
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;