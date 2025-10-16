// src/services/DistribuidoraService.js
import api from './AxiosBase.js'; 

const URL = '/distribuidoras'; // Verifica que este sea el path en tu Spring Boot

class DistribuidoraService {
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
        // Asumiendo que Distribuidora.java usa 'idDistribuidora' o 'id' como PK
        return api.put(`${URL}/${id}`, data); 
    }
    delete(id) {
        return api.delete(`${URL}/${id}`);
    }
}

export default new DistribuidoraService();