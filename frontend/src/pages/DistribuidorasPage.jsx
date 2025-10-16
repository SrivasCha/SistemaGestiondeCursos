import React, { useState, useEffect } from 'react';
import DistribuidoraService from '../services/DistribuidoraService';
import DistribuidoraForm from '../components/DistribuidoraForm'; 

const DistribuidorasPage = () => {
    const [distribuidoras, setDistribuidoras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDistribuidora, setEditingDistribuidora] = useState(null); 

    // Función principal para cargar la lista
    const fetchDistribuidoras = () => {
        setLoading(true);
        // Usamos el servicio para obtener la lista
        DistribuidoraService.getAll()
            .then(response => {
                setDistribuidoras(response.data);
            })
            .catch(error => {
                console.error("Error al cargar distribuidoras:", error);
                alert("Error de conexión. ¿Backend ON?");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDistribuidoras();
    }, []);

    // 1. Manejo del Modal para Crear o Editar
    const handleOpenModal = (distribuidora = null) => {
        setEditingDistribuidora(distribuidora);
        setShowModal(true);
    };

    // 2. Función Eliminar (DELETE)
    const handleDelete = (id) => {
        if (!window.confirm(`⚠️ ¿Está seguro de ELIMINAR la Distribuidora con ID ${id}?`)) return;

        DistribuidoraService.delete(id)
            .then(() => {
                alert("Distribuidora eliminada. 🗑️");
                fetchDistribuidoras(); // Recarga la lista
            })
            .catch(error => {
                alert("Error al eliminar. Verifique que no tenga películas asociadas.");
                console.error(error);
            });
    };

    // 3. Maneja el guardado exitoso desde el formulario
    const handleSave = () => {
        setShowModal(false); 
        fetchDistribuidoras();
    };
    
    // NOTA: Asegúrate de usar 'id' o 'idDistribuidora' según cómo mapee tu backend la PK
    const pkField = distribuidoras.length > 0 && distribuidoras[0].idDistribuidora ? 'idDistribuidora' : 'id';


    if (loading) return <div className="p-4 text-center">Cargando Distribuidoras... 🔄</div>;

    return (
        <div className="mt-5">
            <h2>Gestión de Distribuidoras</h2>
            
            <button className="btn btn-success mb-3" onClick={() => handleOpenModal()}>
                + Registrar Nueva Distribuidora
            </button>

            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>URL</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {distribuidoras.map(d => (
                        <tr key={d[pkField]}>
                            <td>{d[pkField]}</td>
                            <td>{d.nombre}</td>
                            <td>{d.direccion}</td>
                            <td>
                                <a href={d.url} target="_blank" rel="noopener noreferrer">
                                    {d.url}
                                </a>
                            </td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleOpenModal(d)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d[pkField])}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Renderiza el Formulario Modal si showModal es true */}
            {showModal && (
                <DistribuidoraForm 
                    initialData={editingDistribuidora} 
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default DistribuidorasPage;