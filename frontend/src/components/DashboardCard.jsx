import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, iconClass, linkTo }) => {
    return (
        <Link 
            to={linkTo} 
            style={{ textDecoration: 'none' }}
            className="dashboard-card-link"
        >
            <div className="card h-100 shadow-lg" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative',
                cursor: 'pointer'
            }}>
                {/* Efecto de brillo en hover */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
                className="card-hover-effect"
                ></div>

                <div className="card-body" style={{ 
                    padding: '2rem',
                    position: 'relative',
                    zIndex: 2
                }}>
                    {/* Ícono con círculo de fondo */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                            transition: 'transform 0.3s ease'
                        }}
                        className="icon-container"
                        >
                            <i className={`fas ${iconClass}`} style={{ 
                                fontSize: '1.5rem', 
                                color: 'white'
                            }}></i>
                        </div>

                        {/* Indicador de enlace */}
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'rgba(37, 99, 235, 0.15)',
                            border: '1px solid rgba(37, 99, 235, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}
                        className="arrow-container"
                        >
                            <i className="fas fa-arrow-right" style={{ 
                                color: '#3b82f6',
                                fontSize: '0.875rem'
                            }}></i>
                        </div>
                    </div>

                    {/* Título */}
                    <h6 style={{
                        color: '#94a3b8',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.75rem'
                    }}>
                        {title}
                    </h6>

                    {/* Valor principal */}
                    <div style={{
                        fontSize: '2.25rem',
                        fontWeight: '800',
                        color: 'white',
                        lineHeight: '1',
                        marginBottom: '0.5rem',
                        transition: 'transform 0.3s ease'
                    }}
                    className="card-value"
                    >
                        {value}
                    </div>

                    {/* Barra de progreso decorativa */}
                    <div style={{
                        marginTop: '1.5rem',
                        height: '4px',
                        background: 'rgba(100, 116, 139, 0.3)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)',
                            width: '70%',
                            borderRadius: '2px',
                            transition: 'width 0.3s ease'
                        }}
                        className="progress-bar"
                        ></div>
                    </div>
                </div>

                {/* Estilos CSS en línea para los efectos hover */}
                <style>{`
                    .dashboard-card-link:hover .card {
                        transform: translateY(-5px);
                        border-color: #2563eb;
                        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.3) !important;
                    }

                    .dashboard-card-link:hover .card-hover-effect {
                        opacity: 1;
                    }

                    .dashboard-card-link:hover .icon-container {
                        transform: scale(1.1) rotate(5deg);
                    }

                    .dashboard-card-link:hover .arrow-container {
                        background: rgba(37, 99, 235, 0.3);
                        border-color: #2563eb;
                        transform: translateX(3px);
                    }

                    .dashboard-card-link:hover .card-value {
                        transform: scale(1.05);
                    }

                    .dashboard-card-link:hover .progress-bar {
                        width: 100% !important;
                    }
                `}</style>
            </div>
        </Link>
    );
};

export default DashboardCard;