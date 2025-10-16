import React, { useState } from 'react';
import TarifaService from '../services/TarifaService';

const TarifaForm = ({ initialData, onSave, onClose }) => {
    // 1. Inicialización de datos
    const [formData, setFormData] = useState({
        nombre: '',
        precioBase: 0.00,
        periodoDias: 0,
        penalizacionDiaExtra: 0.00,
        ...(initialData || {}) 
    });
    
    const isEdit = !!initialData; 

    // 2. Manejo de cambios
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            // Convertir a número (float o entero) para los campos numéricos
            [name]: type === 'number' ? parseFloat(value) : value, 
        });
    };

    // 3. Manejo del envío (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre || formData.precioBase <= 0 || formData.periodoDias < 0) {
            alert("El Nombre, Precio Base y Período de Días son obligatorios y deben ser válidos.");
            return;
        }
        
        // El ID para PUT (edición)
        const idToUpdate = initialData?.idTarifa || initialData?.id;

        try {
            if (isEdit) {
                await TarifaService.update(idToUpdate, formData); 
                alert("Tarifa actualizada exitosamente. ✅");
            } else {
                await TarifaService.create(formData);
                alert("Tarifa registrada exitosamente. 🎉");
            }
            onSave(); // Cierra el modal y recarga la lista
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            alert(`Error al guardar la tarifa: ${message}`);
            console.error(error);
        }
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Tarifa' : 'Crear Nueva Tarifa'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Nombre */}
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-control" />
                            </div>
                            {/* Precio Base */}
                            <div className="mb-3">
                                <label className="form-label">Precio Base (COP)</label>
                                <input type="number" name="precioBase" value={formData.precioBase} onChange={handleChange} required step="0.01" min="0" className="form-control" />
                            </div>
                            {/* Período Días */}
                            <div className="mb-3">
                                <label className="form-label">Período de Alquiler (Días sin costo extra)</label>
                                <input type="number" name="periodoDias" value={formData.periodoDias} onChange={handleChange} required min="1" className="form-control" />
                            </div>
                            {/* Penalización */}
                            <div className="mb-3">
                                <label className="form-label">Penalización por Día Extra (COP)</label>
                                <input type="number" name="penalizacionDiaExtra" value={formData.penalizacionDiaExtra} onChange={handleChange} required step="0.01" min="0" className="form-control" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Guardar Cambios' : 'Crear Tarifa'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TarifaForm;