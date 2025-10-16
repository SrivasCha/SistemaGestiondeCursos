import React, { useState, useEffect } from 'react';
import ClienteService from '../services/ClienteService'; 

const ClienteForm = ({ initialData, onSave, onClose }) => {
    // Definición del estado inicial del cliente con nombres de campo correctos (según tu modelo Java)
    const [formData, setFormData] = useState({
        numeroIdentificacion: '', 
        nombre: '',
        apellido: '', // Coincide con Cliente.java
        email: '', 
        direccion: '',
        telefono: '',
        fechaRegistro: new Date().toISOString().split('T')[0], // Se asume que este es el campo correcto
    });
    
    const isEdit = !!initialData; 

    // Cargar datos iniciales al editar
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Asegurar formato de fecha correcto para el input type="date"
                fechaRegistro: initialData.fechaRegistro ? initialData.fechaRegistro.split('T')[0] : new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData]);

    // Manejo de cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev,
            [name]: value,
        }));
    };

    // Manejo del envío del formulario (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica
        if (!formData.numeroIdentificacion || !formData.nombre || !formData.apellido || !formData.direccion || !formData.telefono || !formData.email) {
            alert("Todos los campos (Identificación, Nombre, Apellido, Email, Dirección, Teléfono) son obligatorios.");
            return;
        }
        
        // Crear una copia de los datos a guardar. Para la edición, usamos el ID del initialData.
        const dataToSave = { ...formData };

        try {
            if (isEdit) {
                // 👈 CORRECCIÓN CLAVE: Usamos initialData.id (propiedad correcta de tu objeto Java)
                await ClienteService.update(initialData.id, dataToSave); 
                alert("Cliente actualizado exitosamente. ✅");
            } else {
                // Modo Creación: se envían los datos y Spring Boot asigna el ID
                await ClienteService.create(dataToSave);
                alert("Cliente creado exitosamente. 🎉");
            }
            onSave(); // Cierra el modal y recarga la lista
        } catch (error) {
            const apiMessage = error.response ? error.response.data.message : 'Verifique su conexión y el backend.';
            alert(`Error al guardar el cliente: ${apiMessage}`);
            console.error("Error completo del servidor:", error.response || error);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                {/* Cédula / Identificación */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Cédula / Identificación</label>
                                    <input type="text" name="numeroIdentificacion" value={formData.numeroIdentificacion} onChange={handleChange} required className="form-control" />
                                </div>
                                {/* Nombre */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-control" />
                                </div>
                                {/* Apellido (singular) */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Apellido</label>
                                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="form-control" />
                                </div>
                                {/* Email */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
                                </div>
                                {/* Dirección */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Dirección</label>
                                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required className="form-control" />
                                </div>
                                {/* Teléfono */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required className="form-control" />
                                </div>
                                {/* Fecha de Registro */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Fecha de Registro</label>
                                    <input type="date" name="fechaRegistro" value={formData.fechaRegistro} onChange={handleChange} required className="form-control" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Guardar Cambios' : 'Crear Cliente'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClienteForm;