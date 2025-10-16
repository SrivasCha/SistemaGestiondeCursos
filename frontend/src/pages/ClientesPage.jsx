import React, { useState, useEffect } from 'react';
import ClienteService from '../services/ClienteService';
import ClienteForm from '../components/ClienteForm'; 

const ClientesPage = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClientes = () => {
        setLoading(true);
        ClienteService.getAll()
            .then(response => {
                setClientes(response.data);
            })
            .catch(error => {
                console.error("Error al cargar clientes:", error);
                alert("Error de conexión. Asegúrate que el backend de Spring Boot esté activo.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleOpenModal = (cliente = null) => {
        setEditingCliente(cliente);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm(`⚠️ ¿Está seguro de ELIMINAR al Cliente con ID ${id}? Esto es irreversible.`)) return;

        ClienteService.delete(id)
            .then(() => {
                alert("Cliente eliminado. 🗑️");
                fetchClientes();
            })
            .catch(error => {
                alert("Error al eliminar. Verifique que este cliente no tenga alquileres activos.");
                console.error(error);
            });
    };

    const handleSave = () => {
        setShowModal(false);
        fetchClientes();
    };

    // Filtrado de clientes
    const filteredClientes = clientes.filter(c => 
        searchTerm === '' ||
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.numeroIdentificacion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container-fluid p-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fs-5" style={{ color: '#94a3b8' }}>Cargando Clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                    <div>
                        <h2 className="mb-2" style={{ 
                            fontSize: '2rem', 
                            fontWeight: '700',
                            color: 'white'
                        }}>
                            <i className="fas fa-users me-3" style={{ color: '#3b82f6' }}></i>
                            Gestión de Clientes
                        </h2>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>
                            Administra la información de todos los clientes registrados
                        </p>
                    </div>
                    <button 
                        className="btn btn-success mt-3 mt-md-0" 
                        onClick={() => handleOpenModal()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <i className="fas fa-user-plus"></i>
                        Nuevo Cliente
                    </button>
                </div>

                {/* Estadística rápida */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-users mb-2" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Clientes</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{clientes.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-user-check mb-2" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Clientes Activos</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{filteredClientes.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-chart-line mb-2" style={{ fontSize: '1.5rem', color: '#06b6d4' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Base de Datos</h6>
                                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px'
            }}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-search me-2"></i>Buscar Cliente
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
            </div>

            {/* Tabla de clientes */}
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
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.length > 0 ? (
                                filteredClientes.map(cliente => (
                                    <tr key={cliente.id}>
                                        <td style={{ fontWeight: '600' }}>{cliente.id}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background: 'rgba(37, 99, 235, 0.2)',
                                                color: '#000000ff',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px',
                                                fontWeight: '600'
                                            }}>
                                                {cliente.numeroIdentificacion}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '0.75rem'
                                                }}>
                                                    <i className="fas fa-user" style={{ color: 'white' }}></i>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'black' }}>
                                                        {cliente.nombre} {cliente.apellido}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ color: '#000000ff' }}>
                                            <i className="fas fa-map-marker-alt me-2" style={{ color: '#94a3b8' }}></i>
                                            {cliente.direccion}
                                        </td>
                                        <td style={{ color: '#000000ff' }}>
                                            <i className="fas fa-phone me-2" style={{ color: '#94a3b8' }}></i>
                                            {cliente.telefono}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-primary btn-sm" 
                                                    onClick={() => handleOpenModal(cliente)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                    Editar
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm" 
                                                    onClick={() => handleDelete(cliente.id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <i className="fas fa-user-slash mb-3" style={{ fontSize: '3rem', color: '#475569' }}></i>
                                        <p style={{ color: '#94a3b8', marginBottom: 0 }}>No se encontraron clientes</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal del formulario */}
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
                            <ClienteForm 
                                initialData={editingCliente} 
                                onSave={handleSave}
                                onClose={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientesPage;