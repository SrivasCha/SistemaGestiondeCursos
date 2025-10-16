import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import DashboardCard from '../components/DashboardCard';
import api from '../services/AxiosBase.js'; 

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalPeliculas: 0,
        alquileresActivos: 0,
        totalClientes: 0,
        ingresoEstimado: 'Cargando...',
    });
    const [loading, setLoading] = useState(true);

    const fetchMetrics = async () => {
        try {
            const [pelisRes, alquileresRes, clientesRes] = await Promise.all([
                api.get('/peliculas'),
                api.get('/alquileres'),
                api.get('/clientes'),
            ]);

            const activos = alquileresRes.data.filter(a => a.estado === 'Activo').length;
            const ingresos = alquileresRes.data.reduce((sum, a) => sum + (a.importeTotal || 0), 0);

            setMetrics({
                totalPeliculas: pelisRes.data.length,
                alquileresActivos: activos,
                totalClientes: clientesRes.data.length,
                ingresoEstimado: `$ ${ingresos.toLocaleString('es-CO')}`,
            });
        } catch (error) {
            console.error("Error al cargar métricas del dashboard:", error);
            setMetrics(prev => ({ ...prev, ingresoEstimado: 'Error de conexión' }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-5" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fs-5">Cargando Panel de Gestión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{ maxWidth: '1400px', margin: '0 auto' }}> 
            {/* Header con degradado */}
            <div className="mb-5 pb-4" style={{ 
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
                <h2 className="mb-2" style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Tablero de Control
                </h2>
                <p className="mb-0" style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Panel de gestión del Videoclub - Métricas en tiempo real
                </p>
            </div>
            
            {/* Fila de Tarjetas (KPIs) con animación escalonada */}
            <div className="row g-4 mb-5">
                <div className="col-xl-3 col-md-6" style={{ animation: 'fadeIn 0.6s ease-out' }}>
                    <DashboardCard 
                        title="Alquileres Activos" 
                        value={metrics.alquileresActivos} 
                        iconClass="fa-film" 
                        linkTo="/alquileres" 
                    />
                </div>

                <div className="col-xl-3 col-md-6" style={{ animation: 'fadeIn 0.6s ease-out 0.1s', animationFillMode: 'both' }}>
                    <DashboardCard 
                        title="Películas en Catálogo" 
                        value={metrics.totalPeliculas} 
                        iconClass="fa-video" 
                        linkTo="/peliculas" 
                    />
                </div>

                <div className="col-xl-3 col-md-6" style={{ animation: 'fadeIn 0.6s ease-out 0.2s', animationFillMode: 'both' }}>
                    <DashboardCard 
                        title="Clientes Registrados" 
                        value={metrics.totalClientes} 
                        iconClass="fa-users" 
                        linkTo="/clientes" 
                    />
                </div>

                <div className="col-xl-3 col-md-6" style={{ animation: 'fadeIn 0.6s ease-out 0.3s', animationFillMode: 'both' }}>
                    <DashboardCard 
                        title="Ingresos Registrados" 
                        value={metrics.ingresoEstimado} 
                        iconClass="fa-dollar-sign" 
                        linkTo="/alquileres" 
                    />
                </div>
            </div>

            {/* Sección de Accesos Rápidos con diseño mejorado */}
            <div className="mb-4">
                <h3 className="mb-4 pb-3" style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    borderBottom: '2px solid rgba(100, 116, 139, 0.3)',
                    color: 'white'
                }}>
                    <i className="fas fa-bolt me-2" style={{ color: '#3b82f6' }}></i>
                    Accesos Rápidos
                </h3>
            </div>

            <div className="row g-4">
                {/* Tarjeta de Gestión de Inventario */}
                <div className="col-lg-6" style={{ animation: 'slideInLeft 0.6s ease-out' }}>
                    <div className="card h-100 shadow-lg" style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {/* Efecto de brillo en la esquina */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>

                        <div className="card-header" style={{
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                            padding: '1.25rem 1.5rem',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <i className="fas fa-boxes me-2"></i>
                            Gestión de Inventario
                        </div>
                        <div className="card-body" style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
                            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                Administra las copias individuales de las películas y su disponibilidad en tiempo real.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/copias" className="btn btn-info flex-grow-1" style={{ minWidth: '120px' }}>
                                    <i className="fas fa-compact-disc me-2"></i>
                                    Ir a Copias
                                </Link>
                                <Link to="/tarifas" className="btn btn-secondary flex-grow-1" style={{ minWidth: '120px' }}>
                                    <i className="fas fa-tags me-2"></i>
                                    Ir a Tarifas
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Gestión de Personal */}
                <div className="col-lg-6" style={{ animation: 'slideInLeft 0.6s ease-out 0.2s', animationFillMode: 'both' }}>
                    <div className="card h-100 shadow-lg" style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {/* Efecto de brillo en la esquina */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>

                        <div className="card-header" style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            padding: '1.25rem 1.5rem',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <i className="fas fa-user-tie me-2"></i>
                            Gestión de Personal
                        </div>
                        <div className="card-body" style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
                            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                Administra los datos de empleados y distribuidoras de manera eficiente.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/empleados" className="btn btn-success flex-grow-1" style={{ minWidth: '120px' }}>
                                    <i className="fas fa-users me-2"></i>
                                    Ir a Empleados
                                </Link>
                                <Link to="/distribuidoras" className="btn btn-secondary flex-grow-1" style={{ minWidth: '120px' }}>
                                    <i className="fas fa-building me-2"></i>
                                    Distribuidoras
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas adicionales decorativas */}
            <div className="row g-4 mt-4">
                <div className="col-12">
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body text-center py-4">
                            <i className="fas fa-chart-line mb-2" style={{ fontSize: '2rem', color: '#6366f1' }}></i>
                            <h5 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>Sistema de Gestión Integral</h5>
                            <p style={{ color: '#94a3b8', marginBottom: 0, fontSize: '0.95rem' }}>
                                Controla todos los aspectos de tu videoclub desde un solo lugar
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;