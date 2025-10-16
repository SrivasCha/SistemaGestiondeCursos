// src/services/EmpleadoService.js
import api from './AxiosBase.js'; 

const URL = '/empleados';

class EmpleadoService {
    getAll() {
        return api.get(URL);
    }
    getById(id) {
        return api.get(`${URL}/${id}`);
    }
    create(data) {
        return api.post(URL, data);
    }
    update(id, data) {
        // Asumiendo que Empleado.java usa 'id' como clave primaria
        return api.put(`${URL}/${id}`, data); 
    }
    delete(id) {
        return api.delete(`${URL}/${id}`);
    }
}

export default new EmpleadoService();