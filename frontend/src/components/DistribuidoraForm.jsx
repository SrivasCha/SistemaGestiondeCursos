import React, { useState } from 'react';
import DistribuidoraService from '../services/DistribuidoraService';

const DistribuidoraForm = ({ initialData, onSave, onClose }) => {
    // 1. Inicialización de datos (nombre, dirección, url)
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        url: '',
        ...(initialData || {}) 
    });
    
    const isEdit = !!initialData; 

    // 2. Manejo de cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 3. Manejo del envío (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre) {
            alert("El campo Nombre es obligatorio.");
            return;
        }

        try {
            if (isEdit) {
                // Modo Edición: Usa el ID del objeto initialData. Asegúrate de usar el campo de ID correcto (ej: idDistribuidora)
                const idToUpdate = initialData.idDistribuidora || initialData.id; 
                await DistribuidoraService.update(idToUpdate, formData); 
                alert("Distribuidora actualizada exitosamente. ✅");
            } else {
                // Modo Creación
                await DistribuidoraService.create(formData);
                alert("Distribuidora registrada exitosamente. 🎉");
            }
            onSave(); // Cierra el modal y recarga la lista
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            alert(`Error al guardar la distribuidora: ${message}`);
            console.error(error);
        }
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Distribuidora' : 'Registrar Nueva Distribuidora'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Nombre */}
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-control" />
                            </div>
                            {/* Dirección */}
                            <div className="mb-3">
                                <label className="form-label">Dirección</label>
                                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required className="form-control" />
                            </div>
                            {/* URL */}
                            <div className="mb-3">
                                <label className="form-label">URL (Web)</label>
                                <input type="url" name="url" value={formData.url} onChange={handleChange} className="form-control" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Guardar Cambios' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DistribuidoraForm;