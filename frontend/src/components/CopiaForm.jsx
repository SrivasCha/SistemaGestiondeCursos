import React, { useState, useEffect } from 'react';
import CopiaService from '../services/CopiaService';
import PeliculaService from '../services/PeliculaService'; // Para el select de Película

const CopiaForm = ({ initialData, onSave, onClose }) => {
    // Lista de Películas relacionadas
    const [peliculas, setPeliculas] = useState([]);
    const [loadingRelations, setLoadingRelations] = useState(true);

    // 1. Inicialización de datos (incluyendo los nuevos campos)
    const [formData, setFormData] = useState({
        // Campos principales
        codigoInventario: initialData?.codigoInventario || '', 
        // Relación: Usamos la PK de la película para el select
        idPelicula: initialData?.pelicula?.idPelicula || initialData?.pelicula?.id || '',
        
        // 🔑 CAMPOS NUEVOS AÑADIDOS
        numeroRegistro: initialData?.numeroRegistro || '',
        formato: initialData?.formato || '', 
        
        // Mantenemos otros campos que puedan venir en initialData
        ...initialData 
    });
    
    const isEdit = !!initialData; 

    // 2. Cargar datos de Películas al iniciar el componente
    useEffect(() => {
        const fetchRelations = async () => {
            try {
                const pelisRes = await PeliculaService.getAll();
                setPeliculas(pelisRes.data);

                // Si estamos editando, asegurar que se inicialice el ID de película
                if (initialData) {
                    setFormData(prev => ({
                        ...prev,
                        idPelicula: initialData.pelicula?.idPelicula || initialData.pelicula?.id || '',
                        numeroRegistro: initialData.numeroRegistro || '',
                        formato: initialData.formato || '',
                    }));
                }

            } catch (error) {
                console.error("Error cargando películas:", error);
                alert("Error al cargar Películas. Verifique el servicio.");
            } finally {
                setLoadingRelations(false);
            }
        };

        fetchRelations();
    }, [initialData]);

    // 3. Manejo de cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 4. Manejo del envío (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.codigoInventario || !formData.idPelicula || !formData.formato) {
            alert("El Código de Inventario, la Película y el Formato son obligatorios.");
            return;
        }

        // Preparamos el objeto a enviar al backend con el formato de relaciones (ID anidado)
        const payload = {
            codigoInventario: formData.codigoInventario,
            numeroRegistro: formData.numeroRegistro, // Incluye el nuevo campo
            formato: formData.formato,               // Incluye el nuevo campo
            
            // Formato esperado por Spring Boot para la relación Pelicula:
            pelicula: { 
                idPelicula: formData.idPelicula, 
            }, 
        };
        
        // Determinar el ID para PUT (edición).
        const idToUpdate = initialData?.idCopia || initialData?.id;

        try {
            if (isEdit) {
                await CopiaService.update(idToUpdate, payload); 
                alert("Copia actualizada exitosamente. ✅");
            } else {
                await CopiaService.create(payload);
                alert("Copia registrada exitosamente. 🎉");
            }
            onSave(); // Cierra el modal y recarga la lista
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            alert(`Error al guardar la copia: ${message}`);
            console.error(error);
        }
    };

    if (loadingRelations) {
        return <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}><div className="modal-dialog"><div className="modal-content p-4 text-center">Cargando catálogo de películas...</div></div></div>;
    }

    return (
        // El modal d-block se usa para forzar la visibilidad del modal sin jQuery
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Copia' : 'Registrar Nueva Copia'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            
                            <div className="row">
                                {/* Columna 1 */}
                                <div className="col-md-6">
                                    {/* Campo: Código de Inventario */}
                                    <div className="mb-3">
                                        <label className="form-label">Código de Inventario/Registro</label>
                                        <input 
                                            type="text" 
                                            name="codigoInventario" 
                                            value={formData.codigoInventario} 
                                            onChange={handleChange} 
                                            required 
                                            className="form-control" 
                                            placeholder="Ej: C-SW-001"
                                        />
                                        <div className="form-text">Código único de la copia física.</div>
                                    </div>
                                    
                                    {/* 🔑 CAMPO NUEVO: Número de Registro */}
                                    <div className="mb-3">
                                        <label className="form-label">Número de Registro</label>
                                        <input 
                                            type="text" 
                                            name="numeroRegistro" 
                                            value={formData.numeroRegistro}
                                            onChange={handleChange} 
                                            className="form-control" 
                                            placeholder="Ej: A-2023-001 (Opcional)"
                                        />
                                        <div className="form-text">Identificador interno secundario (Opcional).</div>
                                    </div>

                                </div>

                                {/* Columna 2 */}
                                <div className="col-md-6">
                                    {/* SELECT: Película (Relación) */}
                                    <div className="mb-3">
                                        <label className="form-label">Película a la que pertenece</label>
                                        <select 
                                            name="idPelicula" 
                                            value={formData.idPelicula} 
                                            onChange={handleChange} 
                                            required 
                                            className="form-select"
                                        >
                                            <option value="">Seleccione Película</option>
                                            {peliculas.map(p => (
                                                <option key={p.idPelicula || p.id} value={p.idPelicula || p.id}>
                                                    {p.titulo} ({p.anio})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* 🔑 CAMPO NUEVO: Formato */}
                                    <div className="mb-3">
                                        <label className="form-label">Formato de la Copia</label>
                                        <select 
                                            name="formato" 
                                            value={formData.formato} 
                                            onChange={handleChange} 
                                            required 
                                            className="form-select"
                                        >
                                            <option value="">Seleccione el Formato</option>
                                            <option value="DVD">DVD</option>
                                            <option value="Blu-ray">Blu-ray</option>
                                            <option value="4K UHD">4K UHD</option>
                                            <option value="VHS">VHS</option>
                                        </select>
                                        <div className="form-text">Formato físico de la copia.</div>
                                    </div>
                                </div>
                            </div> {/* Fin row */}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Guardar Cambios' : 'Registrar Copia'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CopiaForm;