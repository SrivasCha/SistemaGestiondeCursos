import React, { useState, useEffect } from 'react';
import CopiaService from '../services/CopiaService';
import CopiaForm from '../components/CopiaForm'; 

const CopiasPage = () => {
    const [copias, setCopias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCopia, setEditingCopia] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('Todos');

    const fetchCopias = () => {
        setLoading(true);
        CopiaService.getAll()
            .then(response => {
                setCopias(response.data);
            })
            .catch(error => {
                console.error("Error al cargar copias:", error);
                alert("Error de conexión. ¿Backend ON?");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCopias();
    }, []);

    const handleOpenModal = (copia = null) => {
        setEditingCopia(copia);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm(`⚠️ ¿Está seguro de ELIMINAR la Copia con ID ${id}?`)) return;

        CopiaService.delete(id)
            .then(() => {
                alert("Copia eliminada. 🗑️");
                fetchCopias(); 
            })
            .catch(error => {
                alert("Error al eliminar. Verifique que esta copia no esté actualmente en un alquiler activo.");
                console.error(error);
            });
    };

    const handleSave = () => {
        setShowModal(false); 
        fetchCopias();     
    };

    // Determina el campo PK, usando idCopia si está presente, sino id.
    const pkField = copias.length > 0 && copias[0].idCopia ? 'idCopia' : 'id';

    // Filtrado de copias
    const filteredCopias = copias.filter(c => {
        const matchesSearch = searchTerm === '' ||
            // 🔑 CORRECCIÓN: Usar 'codigoInventario' para coincidir con el backend
            (c.codigoInventario && c.codigoInventario.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.pelicula && c.pelicula.titulo && c.pelicula.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
            
        const matchesEstado = filterEstado === 'Todos' || c.estado === filterEstado;
        return matchesSearch && matchesEstado;
    });

    // Estadísticas
    const stats = {
        total: copias.length,
        disponibles: copias.filter(c => c.estado === 'Disponible').length,
        alquiladas: copias.filter(c => c.estado === 'Alquilada').length
    };

    if (loading) {
        return (
            <div className="container-fluid p-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fs-5" style={{ color: '#94a3b8' }}>Cargando Inventario de Copias...</p>
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
                            <i className="fas fa-compact-disc me-3" style={{ color: '#3b82f6' }}></i>
                            Gestión de Copias (Inventario)
                        </h2>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>
                            Administra todas las copias físicas disponibles en el videoclub
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
                        <i className="fas fa-plus-circle"></i>
                        Nueva Copia
                    </button>
                </div>

                {/* Estadísticas */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-boxes mb-2" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Copias</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{stats.total}</p>
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
                                <i className="fas fa-check-circle mb-2" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Disponibles</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{stats.disponibles}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-clock mb-2" style={{ fontSize: '1.5rem', color: '#f59e0b' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Alquiladas</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{stats.alquiladas}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px'
            }}>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-search me-2"></i>Buscar Copia
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por código de inventario o película..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-filter me-2"></i>Filtrar por Estado
                            </label>
                            <select
                                className="form-select"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="Todos">Todos los Estados</option>
                                <option value="Disponible">Disponibles</option>
                                <option value="Alquilada">Alquiladas</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de copias */}
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
                                <th style={{ padding: '1rem' }}>ID Copia</th>
                                <th>Código Inventario</th>
                                <th>Película</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCopias.length > 0 ? (
                                filteredCopias.map(c => (
                                    <tr key={c[pkField]}>
                                        <td style={{ fontWeight: '600' }}>{c[pkField]}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background: 'rgba(99, 102, 241, 0.2)',
                                                color: '#a5b4fc',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                fontFamily: 'monospace'
                                            }}>
                                                {/* 🔑 CORRECCIÓN: Se usa 'codigoInventario' */}
                                                {c.codigoInventario}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '0.75rem'
                                                }}>
                                                    <i className="fas fa-film" style={{ color: 'white' }}></i>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'black' }}>
                                                        {c.pelicula ? c.pelicula.titulo : 'N/A'}
                                                    </div>
                                                    {c.pelicula && (
                                                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                                            ({c.pelicula.anio})
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {c.estado === 'Alquilada' ? (
                                                <span className="badge" style={{
                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px'
                                                }}>
                                                    <i className="fas fa-clock me-1"></i>Alquilada
                                                </span>
                                            ) : (
                                                <span className="badge" style={{
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px'
                                                }}>
                                                    <i className="fas fa-check-circle me-1"></i>Disponible
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-primary btn-sm" 
                                                    onClick={() => handleOpenModal(c)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm" 
                                                    onClick={() => handleDelete(c[pkField])}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <i className="fas fa-inbox mb-3" style={{ fontSize: '3rem', color: '#475569' }}></i>
                                        <p style={{ color: '#94a3b8', marginBottom: 0 }}>No se encontraron copias</p>
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
                            <CopiaForm 
                                initialData={editingCopia} 
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

export default CopiasPage;