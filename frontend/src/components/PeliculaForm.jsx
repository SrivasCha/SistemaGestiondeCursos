import React, { useState, useEffect } from 'react';
import PeliculaService from '../services/PeliculaService';
import DistribuidoraService from '../services/DistribuidoraService'; // Para el select
import TarifaService from '../services/TarifaService';             // Para el select

const PeliculaForm = ({ initialData, onSave, onClose }) => {
    // Listas de entidades relacionadas
    const [distribuidoras, setDistribuidoras] = useState([]);
    const [tarifas, setTarifas] = useState([]);
    const [loadingRelations, setLoadingRelations] = useState(true);

    // 1. Inicialización de datos
    const [formData, setFormData] = useState({
        titulo: '',
        anio: 0,
        director: '',
        reparto: '',
        // IDs de las relaciones (clave foránea)
        idDistribuidora: '', 
        idTarifa: '', 
        ...(initialData || {}) 
    });
    
    const isEdit = !!initialData; 

    // 2. Cargar datos de Distribuidoras y Tarifas al iniciar el componente
    useEffect(() => {
        const fetchRelations = async () => {
            try {
                const [distRes, tarifaRes] = await Promise.all([
                    DistribuidoraService.getAll(),
                    TarifaService.getAll()
                ]);
                setDistribuidoras(distRes.data);
                setTarifas(tarifaRes.data);

                // Si estamos editando, inicializar los IDs de relación del objeto Pelicula
                if (initialData) {
                    setFormData(prev => ({
                        ...prev,
                        // Asume que la entidad Pelicula devuelve el objeto completo de la relación
                        idDistribuidora: initialData.distribuidora?.idDistribuidora || initialData.distribuidora?.id || '',
                        idTarifa: initialData.tarifa?.idTarifa || initialData.tarifa?.id || '',
                    }));
                }

            } catch (error) {
                console.error("Error cargando relaciones:", error);
                alert("Error al cargar Distribuidoras/Tarifas. Verifique los servicios.");
            } finally {
                setLoadingRelations(false);
            }
        };

        fetchRelations();
    }, [initialData]);

    // 3. Manejo de cambios
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseInt(value) : value,
        });
    };

    // 4. Manejo del envío (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.titulo || !formData.idDistribuidora || !formData.idTarifa) {
            alert("Los campos Título, Distribuidora y Tarifa son obligatorios.");
            return;
        }

        // Preparamos el objeto a enviar al backend con el formato de relaciones (IDs anidados)
        const payload = {
            titulo: formData.titulo,
            anio: formData.anio,
            director: formData.director,
            reparto: formData.reparto,
            // Formato esperado por Spring Boot para las relaciones:
            distribuidora: { idDistribuidora: formData.idDistribuidora },
            tarifa: { idTarifa: formData.idTarifa },
        };
        
        // Determinar el ID para PUT (edición)
        const idToUpdate = initialData?.id_pelicula || initialData?.id;

        try {
            if (isEdit) {
                await PeliculaService.update(idToUpdate, payload); 
                alert("Película actualizada exitosamente. ✅");
            } else {
                await PeliculaService.create(payload);
                alert("Película registrada exitosamente. 🎉");
            }
            onSave(); // Cierra el modal y recarga la lista
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            alert(`Error al guardar la película: ${message}`);
            console.error(error);
        }
    };

    if (loadingRelations) {
        return <div className="p-4 text-center">Cargando datos relacionados...</div>;
    }

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Película' : 'Registrar Nueva Película'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Título */}
                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required className="form-control" />
                            </div>
                            {/* Año */}
                            <div className="mb-3">
                                <label className="form-label">Año</label>
                                <input type="number" name="anio" value={formData.anio} onChange={handleChange} required min="1888" max={new Date().getFullYear()} className="form-control" />
                            </div>
                            {/* Director */}
                            <div className="mb-3">
                                <label className="form-label">Director</label>
                                <input type="text" name="director" value={formData.director} onChange={handleChange} className="form-control" />
                            </div>
                            {/* Reparto */}
                            <div className="mb-3">
                                <label className="form-label">Reparto</label>
                                <input type="text" name="reparto" value={formData.reparto} onChange={handleChange} className="form-control" />
                            </div>

                            {/* SELECT: Distribuidora (Relación 1) */}
                            <div className="mb-3">
                                <label className="form-label">Distribuidora</label>
                                <select name="idDistribuidora" value={formData.idDistribuidora} onChange={handleChange} required className="form-select">
                                    <option value="">Seleccione Distribuidora</option>
                                    {distribuidoras.map(d => (
                                        <option key={d.idDistribuidora || d.id} value={d.idDistribuidora || d.id}>
                                            {d.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* SELECT: Tarifa (Relación 2) */}
                            <div className="mb-3">
                                <label className="form-label">Tarifa de Alquiler</label>
                                <select name="idTarifa" value={formData.idTarifa} onChange={handleChange} required className="form-select">
                                    <option value="">Seleccione Tarifa</option>
                                    {tarifas.map(t => (
                                        <option key={t.idTarifa || t.id} value={t.idTarifa || t.id}>
                                            {t.nombre} (${t.precioBase})
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Guardar Cambios' : 'Registrar Película'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PeliculaForm;