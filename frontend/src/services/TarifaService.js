// src/services/TarifaService.js
import api from './AxiosBase.js'; 

const URL = '/tarifas'; // Verifica que este sea el path en tu Spring Boot

class TarifaService {
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
        // Asumiendo que Tarifa.java usa 'idTarifa' o 'id' como PK
        return api.put(`${URL}/${id}`, data); 
    }
    delete(id) {
        return api.delete(`${URL}/${id}`);
    }
}

export default new TarifaService();