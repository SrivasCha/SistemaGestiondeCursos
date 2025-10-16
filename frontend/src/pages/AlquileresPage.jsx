import React, { useState, useEffect } from 'react';
import AlquilerService from '../services/AlquilerService';
import AlquilerForm from '../components/AlquilerForm'; 

const AlquileresPage = () => {
    const [alquileres, setAlquileres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterEstado, setFilterEstado] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAlquileres = () => {
        setLoading(true);
        AlquilerService.getAll()
            .then(response => {
                console.log("Alquileres cargados:", response.data);
                setAlquileres(response.data);
            })
            .catch(error => {
                console.error("Error al cargar alquileres:", error);
                alert("Error de conexión. ¿Backend ON? Asegúrese de que todos los servicios relacionados estén disponibles.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAlquileres();
    }, []);

    const handleDevolver = async (idAlquiler) => {
        if (!window.confirm("¿Confirmar devolución? Esto calculará los días extra, la penalización y el importe total.")) return;
        
        try {
            const response = await AlquilerService.devolver(idAlquiler);
            console.log("Respuesta devolución:", response.data);
            
            let mensaje = "Devolución registrada exitosamente. ✅\n";
            
            if (response.data.diasRetraso && response.data.diasRetraso > 0) {
                mensaje += `\n⚠️ Días de retraso: ${response.data.diasRetraso}`;
                mensaje += `\n💰 Penalización aplicada`;
            } else {
                mensaje += "\n✅ Devolución a tiempo, sin penalización";
            }
            
            if (response.data.alquiler && response.data.alquiler.importeTotal) {
                mensaje += `\n💵 Importe total: ${formatCurrency(response.data.alquiler.importeTotal)}`;
            }
            
            alert(mensaje);
            fetchAlquileres();
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Error desconocido";
            alert(`Error al procesar devolución: ${message}`);
            console.error(error);
        }
    };
    
    const formatCurrency = (amount) => {
        const safeAmount = amount || 0; 
        return safeAmount.toLocaleString('es-CO', { 
            style: 'currency', 
            currency: 'COP', 
            minimumFractionDigits: 2 
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    
    const pkField = alquileres.length > 0 && alquileres[0].idAlquiler ? 'idAlquiler' : 'id';

    const filteredAlquileres = alquileres.filter(a => {
        const matchesEstado = filterEstado === 'Todos' || a.estado === filterEstado;
        const matchesSearch = searchTerm === '' || 
            (a.cliente && `${a.cliente.nombre} ${a.cliente.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.copia && a.copia.pelicula && a.copia.pelicula.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesEstado && matchesSearch;
    });

    const stats = {
        total: alquileres.length,
        activos: alquileres.filter(a => a.estado === 'Activo').length,
        finalizados: alquileres.filter(a => a.estado === 'Finalizado').length,
        ingresoTotal: alquileres.reduce((sum, a) => sum + (a.importeTotal || 0), 0)
    };

    if (loading) {
        return (
            <div className="container-fluid p-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fs-5" style={{ color: '#94a3b8' }}>Cargando Transacciones de Alquiler...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header con estadísticas */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                    <div>
                        <h2 className="mb-2" style={{ 
                            fontSize: '2rem', 
                            fontWeight: '700',
                            color: 'white'
                        }}>
                            <i className="fas fa-handshake me-3" style={{ color: '#3b82f6' }}></i>
                            Gestión de Alquileres
                        </h2>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>
                            Administra todos los alquileres y devoluciones del videoclub
                        </p>
                    </div>
                    <button 
                        className="btn btn-success mt-3 mt-md-0" 
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <i className="fas fa-plus-circle"></i>
                        Nuevo Alquiler
                    </button>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3 col-sm-6">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-film mb-2" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Alquileres</h6>
                                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-clock mb-2" style={{ fontSize: '1.5rem', color: '#f59e0b' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Activos</h6>
                                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{stats.activos}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-check-circle mb-2" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Finalizados</h6>
                                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{stats.finalizados}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card" style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '12px'
                        }}>
                            <div className="card-body text-center p-3">
                                <i className="fas fa-dollar-sign mb-2" style={{ fontSize: '1.5rem', color: '#06b6d4' }}></i>
                                <h6 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Ingresos Totales</h6>
                                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: 0 }}>{formatCurrency(stats.ingresoTotal)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario Modal */}
            {showForm && (
                <div className="mb-4" style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
                }}>
                    <AlquilerForm 
                        onSave={() => {
                            setShowForm(false); 
                            fetchAlquileres();
                        }}
                        onClose={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Filtros y búsqueda */}
            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px'
            }}>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-search me-2"></i>Buscar
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por cliente o película..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                                <i className="fas fa-filter me-2"></i>Filtrar por Estado
                            </label>
                            <select
                                className="form-select"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="Todos">Todos los Estados</option>
                                <option value="Activo">Activos</option>
                                <option value="Finalizado">Finalizados</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de alquileres */}
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
                                <th>Fecha Alquiler</th>
                                <th>Fecha Devolución Esperada</th>
                                <th>Fecha Devolución Real</th>
                                <th>Cliente</th>
                                <th>Película</th>
                                <th>Estado</th>
                                <th>Importe</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlquileres.length > 0 ? (
                                filteredAlquileres.map(a => {
                                    const fechaDevReal = a.fechaDevolucion ? new Date(a.fechaDevolucion + 'T00:00:00') : null;
                                    const fechaDevEsp = a.fechaDevolucionEsperada ? new Date(a.fechaDevolucionEsperada + 'T00:00:00') : null;
                                    const tieneRetraso = fechaDevReal && fechaDevEsp && fechaDevReal > fechaDevEsp;
                                    
                                    return (
                                        <tr key={a[pkField]}>
                                            <td style={{ fontWeight: '600' }}>{a[pkField]}</td>
                                            <td>{formatDate(a.fechaAlquiler)}</td>
                                            <td>
                                                <span className="badge" style={{
                                                    background: 'rgba(99, 102, 241, 0.2)',
                                                    color: '#a5b4fc',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px'
                                                }}>
                                                    {formatDate(a.fechaDevolucionEsperada)}
                                                </span>
                                            </td>
                                            <td>
                                                {a.fechaDevolucion ? (
                                                    <span className={`badge ${tieneRetraso ? 'bg-danger' : 'bg-success'}`} style={{
                                                        padding: '0.5rem 0.75rem',
                                                        borderRadius: '8px'
                                                    }}>
                                                        {tieneRetraso && <i className="fas fa-exclamation-triangle me-1"></i>}
                                                        {formatDate(a.fechaDevolucion)}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#000000ff', fontSize: '0.875rem' }}>Pendiente</span>
                                                )}
                                            </td>
                                            <td>
                                                {a.cliente ? (
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'black' }}>
                                                            {a.cliente.nombre} {a.cliente.apellidos || a.cliente.apellido}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#000000ff' }}>
                                                            {a.cliente.numeroIdentificacion}
                                                        </div>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td>
                                                {a.copia && a.copia.pelicula ? (
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
                                                                {a.copia.pelicula.titulo}
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                                Copia: {a.copia.codigoInventario || a.copia.codigo_inventario}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td>
                                                {a.estado === 'Activo' ? (
                                                    <span className="badge" style={{
                                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <i className="fas fa-clock me-1"></i>{a.estado}
                                                    </span>
                                                ) : (
                                                    <span className="badge" style={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <i className="fas fa-check-circle me-1"></i>{a.estado}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: '700', color: '#06b6d4' }}>
                                                    {formatCurrency(a.importeTotal)}
                                                </div>
                                                {tieneRetraso && (
                                                    <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>
                                                        <i className="fas fa-exclamation-circle me-1"></i>
                                                        Con penalización
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {a.estado === 'Activo' ? (
                                                    <button 
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleDevolver(a[pkField])}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                    >
                                                        <i className="fas fa-undo"></i>
                                                        Devolver
                                                    </button>
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                        <i className="fas fa-check me-1"></i>Finalizado
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-5">
                                        <i className="fas fa-inbox mb-3" style={{ fontSize: '3rem', color: '#475569' }}></i>
                                        <p style={{ color: '#94a3b8', marginBottom: 0 }}>No se encontraron alquileres</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AlquileresPage;