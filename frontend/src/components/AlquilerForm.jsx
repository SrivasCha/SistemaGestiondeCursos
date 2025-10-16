import React, { useState, useEffect } from 'react';
import AlquilerService from '../services/AlquilerService';
import ClienteService from '../services/ClienteService';
import CopiaService from '../services/CopiaService';
import EmpleadoService from '../services/EmpleadoService';

const AlquilerForm = ({ onSave, onClose }) => {
    const [clientes, setClientes] = useState([]);
    const [copias, setCopias] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [loadingRelations, setLoadingRelations] = useState(true);

    const [formData, setFormData] = useState({
        fechaAlquiler: new Date().toISOString().substring(0, 10), 
        clienteId: '',
        copiaId: '',
        empleadoId: '',
    });

    useEffect(() => {
        const fetchRelations = async () => {
            try {
                const [clientesRes, copiasRes, empleadosRes] = await Promise.all([
                    ClienteService.getAll(),
                    CopiaService.getAll(),
                    EmpleadoService.getAll(),
                ]);
                
                // Filtrar solo copias disponibles
                const copiasDisponibles = copiasRes.data.filter(c => c.disponible === true || c.estado === 'Disponible');
                
                setCopias(copiasDisponibles); 
                setClientes(clientesRes.data);
                setEmpleados(empleadosRes.data);

                console.log("Copias disponibles:", copiasDisponibles);

            } catch (error) {
                console.error("Error cargando datos para alquiler:", error);
                alert("Error al cargar datos. Verifique que los servicios de Clientes, Copias y Empleados estén funcionando.");
            } finally {
                setLoadingRelations(false);
            }
        };

        fetchRelations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.clienteId || !formData.copiaId || !formData.empleadoId) {
            alert("Todos los campos (Cliente, Copia y Empleado) son obligatorios.");
            return;
        }

        // Payload enviado a Spring Boot
        const payload = {
            fechaAlquiler: formData.fechaAlquiler,
            cliente: { id: parseInt(formData.clienteId) }, 
            copia: { idCopia: parseInt(formData.copiaId) }, 
            empleado: { id: parseInt(formData.empleadoId) }
        };
        
        console.log("Enviando payload:", payload);
        
        try {
            const response = await AlquilerService.create(payload);
            console.log("Respuesta del servidor:", response.data);
            alert("Alquiler registrado exitosamente. 🎉");
            onSave();
        } catch (error) {
            console.error("Error completo:", error);
            const message = error.response?.data?.message || error.response?.data || error.message;
            alert(`Error al registrar el alquiler: ${message}`);
        }
    };

    if (loadingRelations) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p style={{ color: '#94a3b8' }}>Cargando datos del formulario...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: 'white', marginBottom: 0 }}>
                    <i className="fas fa-plus-circle me-2" style={{ color: '#10b981' }}></i>
                    Registrar Nuevo Alquiler
                </h4>
                <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={onClose}
                    style={{ borderRadius: '8px' }}
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Fecha Alquiler */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                        <i className="fas fa-calendar me-2"></i>Fecha de Alquiler
                    </label>
                    <input 
                        type="date" 
                        name="fechaAlquiler" 
                        value={formData.fechaAlquiler} 
                        onChange={handleChange} 
                        required 
                        className="form-control"
                        style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            color: 'white'
                        }}
                    />
                    <small style={{ color: '#94a3b8' }}>
                        La fecha de devolución se calculará automáticamente según la tarifa de la película
                    </small>
                </div>
                
                {/* SELECT: Cliente */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                        <i className="fas fa-user me-2"></i>Cliente
                    </label>
                    <select 
                        name="clienteId" 
                        value={formData.clienteId} 
                        onChange={handleChange} 
                        required 
                        className="form-select"
                        style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            color: 'white'
                        }}
                    >
                        <option value="">Seleccione un Cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id} style={{ background: '#1e293b' }}>
                                {c.nombre} {c.apellido || c.apellidos} - Doc: {c.numeroIdentificacion}
                            </option>
                        ))}
                    </select>
                    {clientes.length === 0 && (
                        <small style={{ color: '#f59e0b' }}>
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            No hay clientes registrados
                        </small>
                    )}
                </div>

                {/* SELECT: Copia */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                        <i className="fas fa-film me-2"></i>Película (Copia Disponible)
                    </label>
                    <select 
                        name="copiaId" 
                        value={formData.copiaId} 
                        onChange={handleChange} 
                        required 
                        className="form-select"
                        style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            color: 'white'
                        }}
                    >
                        <option value="">Seleccione una Película Disponible</option>
                        {copias.map(cp => {
                            const copiaId = cp.idCopia || cp.id;
                            const codigoInventario = cp.codigoInventario || cp.codigo_inventario;
                            const peliculaTitulo = cp.pelicula?.titulo || 'Película sin nombre';
                            const peliculaAnio = cp.pelicula?.anio || '';
                            
                            return (
                                <option key={copiaId} value={copiaId} style={{ background: '#1e293b' }}>
                                    {peliculaTitulo} ({peliculaAnio}) - Código: {codigoInventario}
                                </option>
                            );
                        })}
                    </select>
                    {copias.length === 0 && (
                        <small style={{ color: '#f59e0b' }}>
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            No hay copias disponibles para alquilar
                        </small>
                    )}
                </div>

                {/* SELECT: Empleado */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#cbd5e1', fontWeight: '600' }}>
                        <i className="fas fa-user-tie me-2"></i>Empleado que Registra
                    </label>
                    <select 
                        name="empleadoId" 
                        value={formData.empleadoId} 
                        onChange={handleChange} 
                        required 
                        className="form-select"
                        style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(100, 116, 139, 0.3)',
                            color: 'white'
                        }}
                    >
                        <option value="">Seleccione un Empleado</option>
                        {empleados.map(e => (
                            <option key={e.id} value={e.id} style={{ background: '#1e293b' }}>
                                {e.nombre} {e.apellido} - {e.cargo}
                            </option>
                        ))}
                    </select>
                    {empleados.length === 0 && (
                        <small style={{ color: '#f59e0b' }}>
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            No hay empleados registrados
                        </small>
                    )}
                </div>

                <div className="d-flex gap-2 justify-content-end mt-4">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={onClose}
                        style={{ borderRadius: '8px' }}
                    >
                        <i className="fas fa-times me-2"></i>
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={copias.length === 0 || clientes.length === 0 || empleados.length === 0}
                        style={{ borderRadius: '8px' }}
                    >
                        <i className="fas fa-check me-2"></i>
                        Registrar Alquiler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AlquilerForm;