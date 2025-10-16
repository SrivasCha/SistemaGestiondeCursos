import React, { useState, useEffect } from 'react';
import EmpleadoService from '../services/EmpleadoService';
import EmpleadoForm from '../components/EmpleadoForm';

const EmpleadosPage = () => {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEmpleados = () => {
        setLoading(true);
        EmpleadoService.getAll()
            .then(response => setEmpleados(response.data))
            .catch(error => {
                console.error("Error al cargar empleados:", error);
                alert("Error de conexión. ¿Backend ON?");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const handleOpenModal = (empleado = null) => {
        setEditingEmpleado(empleado);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm(`⚠️ ¿Eliminar Empleado con ID ${id}?`)) return;
        EmpleadoService.delete(id)
            .then(() => {
                alert("Empleado eliminado. 🗑️");
                fetchEmpleados();
            })
            .catch(error => {
                alert("Error al eliminar. Verifique que no tenga alquileres asociados.");
                console.error(error);
            });
    };

    const handleSave = () => {
        setShowModal(false);
        fetchEmpleados();
    };

    // 🔑 CORRECCIÓN DEL FILTRADO: Se añade (e.propiedad ?? '') para manejar null/undefined.
    // También se usa 'e.numeroIdentificacion' en lugar de 'e.documento'.
    const filteredEmpleados = empleados.filter(e => {
        if (searchTerm === '') return true; // Si la búsqueda está vacía, muestra todos

        const lowerSearch = searchTerm.toLowerCase();

        // Aplicamos (propiedad ?? '') para prevenir el error de toLowerCase() en null/undefined
        const nombreMatch = (e.nombre ?? '').toLowerCase().includes(lowerSearch);
        const apellidoMatch = (e.apellido ?? '').toLowerCase().includes(lowerSearch);
        const identificacionMatch = (e.numeroIdentificacion ?? '').toLowerCase().includes(lowerSearch);
        const cargoMatch = (e.cargo ?? '').toLowerCase().includes(lowerSearch);
        const emailMatch = (e.email ?? '').toLowerCase().includes(lowerSearch);

        return nombreMatch || apellidoMatch || identificacionMatch || cargoMatch || emailMatch;
    });

    if (loading) {
        return (
            <div className="container-fluid p-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fs-5" style={{ color: '#94a3b8' }}>Cargando Empleados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                    <div>
                        <h2 className="mb-2" style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
                            <i className="fas fa-user-tie me-3" style={{ color: '#3b82f6' }}></i>
                            Gestión de Empleados
                        </h2>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>Administra la información del personal del videoclub</p>
                    </div>
                    <button className="btn btn-success mt-3 mt-md-0" onClick={() => handleOpenModal()}>
                        <i className="fas fa-user-plus me-2"></i>Nuevo Empleado
                    </button>
                </div>

                <div className="card mb-4" style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '16px'
                }}>
                    <div className="card-body">
                        <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                            <i className="fas fa-search me-2"></i>Buscar Empleado
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre, apellido o documento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem' }}>ID</th>
                                <th>Documento</th>
                                <th>Nombre Completo</th>
                                <th>Cargo</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmpleados.length > 0 ? (
                                filteredEmpleados.map(empleado => (
                                    <tr key={empleado.id}>
                                        <td style={{ fontWeight: '600' }}>{empleado.id}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background: 'rgba(2, 5, 139, 0.2)',
                                                color: '#000000ff',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px'
                                            }}>
                                                {/* Se usa el nombre de propiedad correcto */}
                                                {empleado.numeroIdentificacion}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '0.75rem'
                                                }}>
                                                    <i className="fas fa-user" style={{ color: 'white' }}></i>
                                                </div>
                                                <span style={{ fontWeight: '600', color: 'black' }}>
                                                    {empleado.nombre} {empleado.apellido}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge" style={{
                                                background: 'rgba(6, 182, 212, 0.2)',
                                                color: '#000000ff',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px'
                                            }}>
                                                {empleado.cargo}
                                            </span>
                                        </td>
                                        <td style={{ color: '#000000ff' }}>
                                            <i className="fas fa-phone me-2" style={{ color: '#94a3b8' }}></i>
                                            {empleado.telefono}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(empleado)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(empleado.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <i className="fas fa-user-slash mb-3" style={{ fontSize: '3rem', color: '#475569' }}></i>
                                        <p style={{ color: '#94a3b8', marginBottom: 0 }}>No se encontraron empleados</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{
                    display: 'block',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1050,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <EmpleadoForm initialData={editingEmpleado} onSave={handleSave} onClose={() => setShowModal(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmpleadosPage;