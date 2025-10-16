import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', icon: 'fa-home', label: 'Dashboard' },
        { path: '/peliculas', icon: 'fa-film', label: 'Películas' },
        { path: '/alquileres', icon: 'fa-handshake', label: 'Alquileres' },
        { path: '/clientes', icon: 'fa-users', label: 'Clientes' },
        { path: '/copias', icon: 'fa-compact-disc', label: 'Copias' },
        { path: '/empleados', icon: 'fa-user-tie', label: 'Empleados' },
        { path: '/trailers', icon: 'fa-play-circle', label: 'Trailers' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '1rem 0',
            borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="container-fluid px-4">
                {/* Logo y Marca */}
                <Link 
                    className="navbar-brand d-flex align-items-center" 
                    to="/"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                    }}>
                        <i className="fas fa-film" style={{ fontSize: '1.25rem' }}></i>
                    </div>
                    <span style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        VideoClub Pro
                    </span>
                </Link>

                {/* Botón de toggle para móvil */}
                <button 
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        border: '2px solid rgba(37, 99, 235, 0.5)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem'
                    }}
                >
                    <i className={`fas ${expanded ? 'fa-times' : 'fa-bars'}`} style={{ color: '#3b82f6' }}></i>
                </button>

                {/* Menú de navegación */}
                <div 
                    className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}
                    style={{ flexGrow: 1 }}
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center" style={{ gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.path}>
                                <Link
                                    className="nav-link"
                                    to={item.path}
                                    onClick={() => setExpanded(false)}
                                    style={{
                                        color: isActive(item.path) ? 'white' : '#94a3b8',
                                        fontWeight: isActive(item.path) ? '700' : '600',
                                        fontSize: '0.925rem',
                                        padding: '0.625rem 1.25rem',
                                        borderRadius: '10px',
                                        background: isActive(item.path) 
                                            ? 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)'
                                            : 'transparent',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        border: isActive(item.path) 
                                            ? 'none' 
                                            : '1px solid transparent',
                                        boxShadow: isActive(item.path)
                                            ? '0 4px 15px rgba(37, 99, 235, 0.4)'
                                            : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive(item.path)) {
                                            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
                                            e.currentTarget.style.color = '#3b82f6';
                                            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive(item.path)) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#94a3b8';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }
                                    }}
                                >
                                    <i className={`fas ${item.icon}`}></i>
                                    <span>{item.label}</span>
                                    {isActive(item.path) && (
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            marginLeft: '0.25rem'
                                        }}></div>
                                    )}
                                </Link>
                            </li>
                        ))}

                        {/* Botón de perfil/configuración */}
                        <li className="nav-item ms-lg-3">
                            <button
                                className="btn"
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                                    border: '1px solid rgba(37, 99, 235, 0.3)',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'rotate(90deg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)';
                                    e.currentTarget.style.color = '#3b82f6';
                                    e.currentTarget.style.transform = 'rotate(0deg)';
                                }}
                            >
                                <i className="fas fa-cog"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;