import React, { useState } from 'react';
import EmpleadoService from '../services/EmpleadoService';

const EmpleadoForm = ({ initialData, onSave, onClose }) => {
    // Definimos el objeto base si no hay datos iniciales
    const client = initialData || {};
    
    // 1. Inicialización de datos con Null Coalescing (?? '') para evitar errores de React con 'null'
    const [formData, setFormData] = useState({
        // 🛑 CAMBIADO: 'documento' por 'numeroIdentificacion' (según Empleado.java)
        numeroIdentificacion: client.numeroIdentificacion ?? '', 
        nombre: client.nombre ?? '',
        apellido: client.apellido ?? '',
        // 🛑 AÑADIDO: Campo obligatorio 'email' (según Empleado.java)
        email: client.email ?? '', 
        cargo: client.cargo ?? '',
        telefono: client.telefono ?? '',
        // 🛑 REMOVIDO: 'direccion' (No existe en Empleado.java)
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
        
        // 🛑 CORRECCIÓN DE VALIDACIÓN: Todos los campos obligatorios de Empleado.java
        if (!formData.numeroIdentificacion || !formData.nombre || !formData.apellido || !formData.email || !formData.cargo) {
            alert("Los campos Número de Identificación, Nombre, Apellido, Email y Cargo son obligatorios.");
            return;
        }

        try {
            if (isEdit) {
                // Modo Edición: Usa el ID del objeto initialData
                await EmpleadoService.update(initialData.id, formData); 
                alert("Empleado actualizado exitosamente. ✅");
            } else {
                // Modo Creación
                await EmpleadoService.create(formData);
                alert("Empleado registrado exitosamente. 🎉");
            }
            onSave(); // Cierra el modal y recarga la lista
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            alert(`Error al guardar el empleado: ${message}`);
            console.error(error);
        }
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Número de Identificación (antes Documento) */}
                            <div className="mb-3">
                                <label className="form-label">Número de Identificación</label>
                                {/* 🛑 CAMBIADO: name="documento" a name="numeroIdentificacion" */}
                                <input 
                                    type="text" 
                                    name="numeroIdentificacion" 
                                    value={formData.numeroIdentificacion} 
                                    onChange={handleChange} 
                                    required 
                                    className="form-control" 
                                />
                            </div>
                            
                            {/* Nombre */}
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-control" />
                            </div>
                            
                            {/* Apellido */}
                            <div className="mb-3">
                                <label className="form-label">Apellido</label>
                                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="form-control" />
                            </div>
                            
                            {/* 🛑 NUEVO CAMPO: Email */}
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
                            </div>
                            
                            {/* Cargo */}
                            <div className="mb-3">
                                <label className="form-label">Cargo</label>
                                <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} required className="form-control" />
                            </div>
                            
                            {/* Teléfono */}
                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="form-control" />
                            </div>
                            
                            {/* 🛑 REMOVIDO: El campo 'Dirección' fue eliminado ya que no existe en Empleado.java */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Guardar Cambios' : 'Registrar Empleado'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmpleadoForm;