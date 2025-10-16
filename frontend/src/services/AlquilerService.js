import axios from 'axios';

const API_URL = 'http://localhost:8080/api/alquileres';

const AlquilerService = {
    // Obtener todos los alquileres
    getAll: () => {
        return axios.get(API_URL);
    },

    // Obtener un alquiler por ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // Crear un nuevo alquiler
    create: (alquiler) => {
        console.log('Creando alquiler con datos:', alquiler);
        return axios.post(API_URL, alquiler);
    },

    // Actualizar un alquiler
    update: (id, alquiler) => {
        return axios.put(`${API_URL}/${id}`, alquiler);
    },

    // Procesar devolución de un alquiler
    devolver: (id) => {
        console.log('Procesando devolución para alquiler:', id);
        return axios.put(`${API_URL}/devolver/${id}`);
    },

    // Eliminar un alquiler
    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    // Obtener alquileres por cliente
    getByCliente: (clienteId) => {
        return axios.get(`${API_URL}/cliente/${clienteId}`);
    },

    // Obtener alquileres activos
    getActivos: () => {
        return axios.get(`${API_URL}/activos`);
    },

    // Obtener alquileres finalizados
    getFinalizados: () => {
        return axios.get(`${API_URL}/finalizados`);
    }
};

export default AlquilerService;