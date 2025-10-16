import React from 'react';
import { Outlet } from 'react-router-dom'; 
import NavBar from './NavBar';

const Layout = () => {
    return (
        <div className="main-layout w-100" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            backgroundAttachment: 'fixed'
        }}>
            {/* NavBar con efecto de elevación */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
                <NavBar /> 
            </div>
            
            {/* Contenedor principal del contenido con animación de entrada */}
            <div className="content-area w-100" style={{
                minHeight: 'calc(100vh - 80px)',
                paddingTop: '2rem',
                paddingBottom: '3rem',
                position: 'relative'
            }}> 
                {/* Efecto de partículas decorativas en el fondo */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0,
                    opacity: 0.4
                }}>
                    {/* Círculos decorativos flotantes */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 20s ease-in-out infinite'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '5%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 25s ease-in-out infinite reverse'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 30s ease-in-out infinite'
                    }}></div>
                </div>

                {/* Contenido de las páginas */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Outlet /> 
                </div>
            </div>

            {/* Footer opcional decorativo */}
            <footer style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
                padding: '1.5rem 0',
                textAlign: 'center',
                borderTop: '1px solid rgba(100, 116, 139, 0.3)',
                marginTop: 'auto'
            }}>
                <div className="container">
                    <p style={{ 
                        margin: 0, 
                        color: '#94a3b8', 
                        fontSize: '0.875rem',
                        fontWeight: '500'
                    }}>
                        <i className="fas fa-film me-2" style={{ color: '#3b82f6' }}></i>
                        Sistema de Gestión de Videoclub © 2025 <br></br>
                        Por: Santiago Rivas E192 Web Services
                    </p>
                </div>
            </footer>

            {/* Estilos CSS en línea para las animaciones */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    33% {
                        transform: translateY(-30px) translateX(20px);
                    }
                    66% {
                        transform: translateY(20px) translateX(-20px);
                    }
                }
            `}</style>
        </div>
    );
};

export default Layout;