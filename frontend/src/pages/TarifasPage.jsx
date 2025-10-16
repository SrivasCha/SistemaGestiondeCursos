import React, { useState, useEffect } from 'react';
import TarifaService from '../services/TarifaService';
import TarifaForm from '../components/TarifaForm'; 

const TarifasPage = () => {
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTarifa, setEditingTarifa] = useState(null); 

    // Función principal para cargar la lista de tarifas
    const fetchTarifas = () => {
        setLoading(true);
        TarifaService.getAll()
            .then(response => {
                setTarifas(response.data);
            })
            .catch(error => {
                console.error("Error al cargar tarifas:", error);
                alert("Error de conexión. ¿Backend ON?");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTarifas();
    }, []);

    // 1. Manejo del Modal para Crear o Editar
    const handleOpenModal = (tarifa = null) => {
        setEditingTarifa(tarifa);
        setShowModal(true);
    };

    // 2. Función Eliminar (DELETE)
    const handleDelete = (id) => {
        if (!window.confirm(`⚠️ ¿Está seguro de ELIMINAR la Tarifa con ID ${id}?`)) return;

        TarifaService.delete(id)
            .then(() => {
                alert("Tarifa eliminada. 🗑️");
                fetchTarifas(); // Recarga la lista
            })
            .catch(error => {
                alert("Error al eliminar. Verifique que no tenga películas asociadas a esta tarifa.");
                console.error(error);
            });
    };

    // 3. Maneja el guardado exitoso desde el formulario
    const handleSave = () => {
        setShowModal(false); 
        fetchTarifas();
    };
    
    // Determinar el campo de clave primaria (PK)
    const pkField = tarifas.length > 0 && tarifas[0].idTarifa ? 'idTarifa' : 'id';

    // Función de ayuda para formatear moneda
    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }) : '$ 0.00';
    };


    if (loading) return <div className="p-4 text-center">Cargando Tarifas... 🔄</div>;

    return (
        <div className="mt-5">
            <h2>Gestión de Tarifas</h2>
            
            <button className="btn btn-success mb-3" onClick={() => handleOpenModal()}>
                + Crear Nueva Tarifa
            </button>

            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio Base</th>
                        <th>Período (Días)</th>
                        <th>Penalización/Día</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tarifas.map(t => (
                        <tr key={t[pkField]}>
                            <td>{t[pkField]}</td>
                            <td>{t.nombre}</td>
                            <td>{formatCurrency(t.precioBase)}</td>
                            <td>{t.periodoDias}</td>
                            <td>{formatCurrency(t.penalizacionDiaExtra)}</td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleOpenModal(t)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t[pkField])}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Renderiza el Formulario Modal si showModal es true */}
            {showModal && (
                <TarifaForm 
                    initialData={editingTarifa} 
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default TarifasPage;