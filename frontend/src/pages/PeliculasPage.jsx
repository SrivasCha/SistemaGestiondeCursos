import React, { useState, useEffect } from 'react';
import PeliculaService from '../services/PeliculaService';
import PeliculaForm from '../components/PeliculaForm'; 

const PeliculasPage = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPelicula, setEditingPelicula] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('Todos');
    const [viewMode, setViewMode] = useState('table'); // 'table' o 'grid'

    const fetchPeliculas = () => {
        setLoading(true);
        PeliculaService.getAll()
            .then(response => {
                setPeliculas(response.data);
            })
            .catch(error => {
                console.error("Error al cargar películas:", error);
                alert("Error de conexión. ¿Backend ON?");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPeliculas();
    }, []);

    const handleOpenModal = (pelicula = null) => {
        setEditingPelicula(pelicula);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm(`⚠️ ¿Está seguro de ELIMINAR la Película con ID ${id}? Esto eliminará también todas sus copias asociadas.`)) return;

        PeliculaService.delete(id)
            .then(() => {
                alert("Película eliminada. 🗑️");
                fetchPeliculas(); 
            })
            .catch(error => {
                alert("Error al eliminar. Verifique que no haya copias de esta película en alquileres activos o históricos.");
                console.error(error);
            });
    };

    const handleSave = () => {
        setShowModal(false); 
        fetchPeliculas();      
    };

    const pkField = peliculas.length > 0 && peliculas[0].id_pelicula ? 'id_pelicula' : 'id';

    // Obtener años únicos para el filtro
    const uniqueYears = ['Todos', ...new Set(peliculas.map(p => p.anio).filter(Boolean).sort((a, b) => b - a))];

    // Filtrado de películas
    const filteredPeliculas = peliculas.filter(p => {
        const matchesSearch = searchTerm === '' ||
            p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.director && p.director.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesYear = filterYear === 'Todos' || p.anio === parseInt(filterYear);
        return matchesSearch && matchesYear;
    });

    if (loading) {
        return (
            <div className="container-fluid p-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fs-5" style={{ color: '#94a3b8' }}>Cargando Catálogo de Películas...</p>
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
                            <i className="fas fa-film me-3" style={{ color: '#3b82f6' }}></i>
                            Gestión de Películas
                        </h2>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>
                            Administra el catálogo completo de películas del videoclub
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
                        Nueva Película
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
                                <i className="fas fa-video mb-2" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Películas</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{peliculas.length}</p>
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
                                <i className="fas fa-filter mb-2" style={{ fontSize: '1.5rem', color: '#f59e0b' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Filtradas</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{filteredPeliculas.length}</p>
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
                                <i className="fas fa-calendar mb-2" style={{ fontSize: '1.5rem', color: '#06b6d4' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Años Disponibles</h6>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{uniqueYears.length - 1}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px'
            }}>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-search me-2"></i>Buscar Película
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por título o director..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-calendar me-2"></i>Filtrar por Año
                            </label>
                            <select
                                className="form-select"
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                            >
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-eye me-2"></i>Vista
                            </label>
                            <div className="btn-group w-100" role="group">
                                <button 
                                    className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('table')}
                                >
                                    <i className="fas fa-list"></i> Tabla
                                </button>
                                <button 
                                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <i className="fas fa-th"></i> Cuadrícula
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vista de tabla */}
            {viewMode === 'table' ? (
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
                                    <th>Título</th>
                                    <th>Director</th>
                                    <th>Año</th>
                                    <th>Distribuidora</th>
                                    <th>Tarifa</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPeliculas.length > 0 ? (
                                    filteredPeliculas.map(p => (
                                        <tr key={p[pkField]}>
                                            <td style={{ fontWeight: '600' }}>{p[pkField]}</td>
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
                                                    <div style={{ fontWeight: '600', color: 'black' }}>{p.titulo}</div>
                                                </div>
                                            </td>
                                            <td style={{ color: '#000000ff' }}>
                                                <i className="fas fa-user-tie me-2" style={{ color: '#94a3b8' }}></i>
                                                {p.director}
                                            </td>
                                            <td>
                                                <span className="badge" style={{
                                                    background: 'rgba(6, 182, 212, 0.2)',
                                                    color: '#000000ff',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px',
                                                    fontWeight: '600'
                                                }}>
                                                    {p.anio}
                                                </span>
                                            </td>
                                            <td style={{ color: '#000000ff' }}>
                                                {p.distribuidora ? p.distribuidora.nombre : 'N/A'}
                                            </td>
                                            <td style={{ color: '#000000ff' }}>
                                                {p.tarifa ? p.tarifa.nombre : 'N/A'}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="btn btn-primary btn-sm" 
                                                        onClick={() => handleOpenModal(p)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-sm" 
                                                        onClick={() => handleDelete(p[pkField])}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <i className="fas fa-film mb-3" style={{ fontSize: '3rem', color: '#475569' }}></i>
                                            <p style={{ color: '#94a3b8', marginBottom: 0 }}>No se encontraron películas</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Vista de cuadrícula */
                <div className="row g-4">
                    {filteredPeliculas.length > 0 ? (
                        filteredPeliculas.map(p => (
                            <div key={p[pkField]} className="col-lg-3 col-md-4 col-sm-6">
                                <div className="card h-100" style={{
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    border: '1px solid rgba(100, 116, 139, 0.3)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        height: '250px',
                                        background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <i className="fas fa-film" style={{ fontSize: '4rem', color: 'white', opacity: 0.5 }}></i>
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(0, 0, 0, 0.7)',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontWeight: '700'
                                        }}>
                                            {p.anio}
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ color: 'white', marginBottom: '0.5rem' }}>
                                            {p.titulo}
                                        </h5>
                                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                            <i className="fas fa-user-tie me-2"></i>
                                            {p.director}
                                        </p>
                                        <div className="mb-2" style={{ fontSize: '0.875rem' }}>
                                            <span style={{ color: '#cbd5e1' }}>
                                                <i className="fas fa-building me-2" style={{ color: '#94a3b8' }}></i>
                                                {p.distribuidora ? p.distribuidora.nombre : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="mb-3" style={{ fontSize: '0.875rem' }}>
                                            <span style={{ color: '#cbd5e1' }}>
                                                <i className="fas fa-tag me-2" style={{ color: '#94a3b8' }}></i>
                                                {p.tarifa ? p.tarifa.nombre : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-primary btn-sm flex-grow-1" 
                                                onClick={() => handleOpenModal(p)}
                                            >
                                                <i className="fas fa-edit me-1"></i>
                                                Editar
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(p[pkField])}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <i className="fas fa-film mb-3" style={{ fontSize: '4rem', color: '#475569' }}></i>
                            <p style={{ color: '#94a3b8', marginBottom: 0 }}>No se encontraron películas</p>
                        </div>
                    )}
                </div>
            )}

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
                            <PeliculaForm 
                                initialData={editingPelicula} 
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

export default PeliculasPage;