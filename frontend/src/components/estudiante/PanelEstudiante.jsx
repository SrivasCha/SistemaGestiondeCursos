import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../../styles/EstudiantePanel.css';

const PanelEstudiante = () => {
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState({});
  const [cursos, setCursos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [horario, setHorario] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Debes iniciar sesión primero', 'error');
      navigate('/login');
    } else {
      cargarDatosEstudiante();
    }
  }, []);

  const cargarDatosEstudiante = async () => {
    try {
      const [resEstudiante, resCursos, resNotas] = await Promise.all([
        api.get('/api/estudiantes/usuario-actual'),
        api.get('/api/estudiantes/mis-cursos'),
        api.get('/api/notas/estudiante')
      ]);
      
      setEstudiante(resEstudiante.data);
      setCursos(resCursos.data);
      setNotas(resNotas.data);
      generarHorario(resCursos.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    }
  };

  const generarHorario = (cursos) => {
    const eventos = cursos.flatMap(curso => 
      curso.horarios.map(h => ({
        title: curso.nombre,
        daysOfWeek: [h.diaSemana === 'LUNES' ? 1 : h.diaSemana === 'MARTES' ? 2 : 3],
        startTime: h.horaInicio,
        endTime: h.horaFin,
        color: '#4CAF50'
      }))
    );
    setHorario(eventos);
  };

  const generarReportePDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();
    
    doc.setFontSize(18);
    doc.text(`Reporte de Calificaciones - ${estudiante.nombre}`, 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generado: ${fecha}`, 14, 30);
    
    doc.autoTable({
      head: [['Curso', 'Profesor', 'Calificación', 'Fecha']],
      body: notas.map(nota => [
        nota.curso.nombre,
        nota.curso.profesor.nombre,
        nota.calificacion.toFixed(2),
        new Date(nota.fechaRegistro).toLocaleDateString()
      ]),
      startY: 40,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 3,
        fillColor: [76, 175, 80] 
      },
      headStyles: {
        fillColor: [67, 160, 71],
        textColor: 255
      }
    });
    
    doc.save(`reporte-${fecha}.pdf`);
  };

  const actualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/estudiantes', estudiante);
      Swal.fire('¡Actualizado!', 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  return (
    <div className="admin-panel-bg">
      {/* Resto del JSX del panel */}
    </div>
  );
};

export default PanelEstudiante;
