// src/services/ClienteService.js
import api from './AxiosBase.js'; // Importa tu base configurada

const URL = '/clientes';

class ClienteService {
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
        // En Spring Boot, el ID suele ir en la URL para el PUT
        return api.put(`${URL}/${id}`, data); 
    }
    delete(id) {
        return api.delete(`${URL}/${id}`);
    }
}

export default new ClienteService();