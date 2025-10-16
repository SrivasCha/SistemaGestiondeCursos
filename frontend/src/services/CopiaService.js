// src/services/CopiaService.js
import api from './AxiosBase.js'; 

const URL = '/copias'; 

class CopiaService {
    getAll() {
        return api.get(URL);
    }
    getById(id) {
        return api.get(`${URL}/${id}`);
    }
    create(data) {
        // Asumiendo que el backend espera { codigo_inventario: 'C123', pelicula: { id: 1 } }
        return api.post(URL, data);
    }
    update(id, data) {
        return api.put(`${URL}/${id}`, data); 
    }
    delete(id) {
        return api.delete(`${URL}/${id}`);
    }
}

export default new CopiaService();