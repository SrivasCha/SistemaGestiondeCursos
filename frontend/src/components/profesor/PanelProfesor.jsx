import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Card, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { getToken, getRol, logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/PanelProfesor.css'; // Importar estilos personalizados
import { format } from 'date-fns'; // Para formatear fechas

const PanelProfesor = () => {
    const [profesor, setProfesor] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentsInCourse, setStudentsInCourse] = useState([]);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [showNotaModal, setShowNotaModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [notaForm, setNotaForm] = useState({ valor: '', tipo: '', descripcion: '', fecha: format(new Date(), 'yyyy-MM-dd') });
    const [editNotaId, setEditNotaId] = useState(null);
    const [attendanceData, setAttendanceData] = useState({});
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [currentAttendanceList, setCurrentAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const userRol = getRol();
            if (userRol !== 'PROFESOR') {
                toast.error('Acceso denegado. Solo profesores pueden acceder a este panel.');
                navigate('/login');
                return;
            }
            fetchProfesorData();
        };
        checkAuth();
    }, []);

const fetchProfesorData = async () => {
        try {
            setLoading(true);
            setError('');
            const token = getToken();
            const profesorRes = await api.get('/api/profesor/me', { headers: { Authorization: `Bearer ${token}` } });
            setProfesor(profesorRes.data);

            // 🐛 CORRECCIÓN: Añadir /api/ al path
            const cursosRes = await api.get('/api/profesor/mis-cursos', { headers: { Authorization: `Bearer ${token}` } });
            setCursos(cursosRes.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar datos del profesor: ' + (err.response?.data?.message || err.message));
            setLoading(false);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
                navigate('/login');
            }
        }
    };

    const handleViewStudents = async (course) => {
        try {
            setError('');
            const token = getToken();
            const res = await api.get(`/profesor/cursos/${course.id}/estudiantes`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedCourse(course);
            setStudentsInCourse(res.data);
            setShowStudentsModal(true);
        } catch (err) {
            setError('Error al cargar estudiantes del curso: ' + (err.response?.data?.message || err.message));
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
                navigate('/login');
            }
        }
    };

    const handleAssignNota = (student, currentNota = null) => {
        setCurrentStudent(student);
        if (currentNota) {
            setNotaForm({
                valor: currentNota.calificacion,
                tipo: currentNota.tipo,
                descripcion: currentNota.descripcion,
                fecha: format(new Date(currentNota.fechaRegistro), 'yyyy-MM-dd')
            });
            setEditNotaId(currentNota.id);
        } else {
            setNotaForm({ valor: '', tipo: '', descripcion: '', fecha: format(new Date(), 'yyyy-MM-dd') });
            setEditNotaId(null);
        }
        setShowNotaModal(true);
    };

    const handleSaveNota = async () => {
        try {
            setError('');
            const token = getToken();
            if (!currentStudent || !selectedCourse) {
                setError('Estudiante o curso no seleccionado.');
                return;
            }

            const payload = {
                estudianteId: currentStudent.id,
                cursoId: selectedCourse.id,
                valor: parseFloat(notaForm.valor),
                tipo: notaForm.tipo,
                descripcion: notaForm.descripcion,
                fecha: notaForm.fecha
            };

            if (editNotaId) {
                // Si existe un editNotaId, se asume que la API de notas manejará la actualización
                // basándose en la descripción y la existencia de la nota, como se implementó en el backend.
                // No hay un endpoint PUT específico para notas por ID en el ProfesorController actual.
                // La lógica del backend ya maneja la actualización si 'buscarPorEstudianteCursoYDescripcion' encuentra una nota.
            }

            await api.post('/profesor/notas', payload, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(editNotaId ? 'Nota actualizada exitosamente!' : 'Nota asignada exitosamente!');
            setShowNotaModal(false);
            // Refrescar la lista de estudiantes para ver la nota actualizada
            handleViewStudents(selectedCourse);
        } catch (err) {
            setError('Error al guardar la nota: ' + (err.response?.data?.message || err.message));
            toast.error('Error al guardar la nota: ' + (err.response?.data?.message || 'Error desconocido'));
        }
    };

    const handleAttendance = async (course) => {
        try {
            setError('');
            const token = getToken();
            setSelectedCourse(course);

            // Obtener lista de estudiantes para este curso (si no la tenemos ya)
            if (!studentsInCourse.length || selectedCourse.id !== course.id) {
                const studentsRes = await api.get(`/profesor/cursos/${course.id}/estudiantes`, { headers: { Authorization: `Bearer ${token}` } });
                setStudentsInCourse(studentsRes.data);
            }

            // Fetch existing attendance for the selected date
            const attendanceRes = await api.get(`/profesor/asistencia/${course.id}/${attendanceDate}`, { headers: { Authorization: `Bearer ${token}` } });
            const existingAttendanceMap = new Map(attendanceRes.data.map(a => [a.estudiante.id, a.presente]));

            // Initialize attendanceData based on students in course and existing attendance
            const initialAttendance = {};
            const initialCurrentAttendanceList = [];
            studentsInCourse.forEach(student => {
                const isPresent = existingAttendanceMap.has(student.id) ? existingAttendanceMap.get(student.id) : true; // Default to present
                initialAttendance[student.id] = isPresent;
                initialCurrentAttendanceList.push({ ...student, presente: isPresent });
            });
            setAttendanceData(initialAttendance);
            setCurrentAttendanceList(initialCurrentAttendanceList);
            setShowAttendanceModal(true);

        } catch (err) {
            setError('Error al cargar datos de asistencia: ' + (err.response?.data?.message || err.message));
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
                navigate('/login');
            }
        }
    };

    const handleAttendanceChange = (studentId, isPresent) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: isPresent
        }));
        setCurrentAttendanceList(prev => prev.map(student =>
            student.id === studentId ? { ...student, presente: isPresent } : student
        ));
    };

    const handleSaveAttendance = async () => {
        try {
            setError('');
            const token = getToken();
            if (!selectedCourse || !attendanceDate) {
                setError('Curso o fecha de asistencia no seleccionada.');
                return;
            }

            const payload = {
                cursoId: selectedCourse.id,
                fecha: attendanceDate,
                asistencias: Object.keys(attendanceData).map(studentId => ({
                    estudianteId: parseInt(studentId),
                    presente: attendanceData[studentId]
                }))
            };

            await api.post('/profesor/asistencia', payload, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Asistencia guardada exitosamente!');
            setShowAttendanceModal(false);
            // Optionally, refresh attendance data or status after saving
        } catch (err) {
            setError('Error al guardar la asistencia: ' + (err.response?.data?.message || err.message));
            toast.error('Error al guardar la asistencia: ' + (err.response?.data?.message || 'Error desconocido'));
        }
    };

    const handleAttendanceDateChange = async (e) => {
        const newDate = e.target.value;
        setAttendanceDate(newDate);

        try {
            setError('');
            const token = getToken();
            const attendanceRes = await api.get(`/profesor/asistencia/${selectedCourse.id}/${newDate}`, { headers: { Authorization: `Bearer ${token}` } });
            const existingAttendanceMap = new Map(attendanceRes.data.map(a => [a.estudiante.id, a.presente]));

            const updatedAttendanceData = {};
            const updatedCurrentAttendanceList = studentsInCourse.map(student => {
                const isPresent = existingAttendanceMap.has(student.id) ? existingAttendanceMap.get(student.id) : true;
                updatedAttendanceData[student.id] = isPresent;
                return { ...student, presente: isPresent };
            });
            setAttendanceData(updatedAttendanceData);
            setCurrentAttendanceList(updatedCurrentAttendanceList);
        } catch (err) {
            setError('Error al cargar asistencia para la nueva fecha: ' + (err.response?.data?.message || err.message));
            // If no attendance found for the date, re-initialize to all present
            const initialAttendance = {};
            const initialCurrentAttendanceList = [];
            studentsInCourse.forEach(student => {
                initialAttendance[student.id] = true; // Default to present for new date
                initialCurrentAttendanceList.push({ ...student, presente: true });
            });
            setAttendanceData(initialAttendance);
            setCurrentAttendanceList(initialCurrentAttendanceList);
        }
    };

    if (loading) {
        return (
            <Container className="panel-profesor-container mt-5">
                <Alert variant="info">Cargando datos del profesor...</Alert>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="panel-profesor-container mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <div className="admin-panel-wrapper">
            <Container className="panel-profesor-container mt-5">
                <Card className="admin-header-card mb-4 shadow-sm">
                    <Card.Body>
                        <h2 className="admin-header-title">
                            <i className="fas fa-chalkboard-teacher me-2"></i>
                            Panel del Profesor
                        </h2>
                        <p className="admin-header-subtitle">
                            Bienvenido, {profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Profesor'}.
                            Gestiona tus cursos, notas y asistencia.
                        </p>
                    </Card.Body>
                </Card>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Card className="data-card mb-4 shadow-sm">
                    <Card.Header className="data-card-header">
                        <h3 className="data-card-title">
                            <i className="fas fa-book-open me-2"></i>
                            Mis Cursos
                        </h3>
                    </Card.Header>
                    <Card.Body className="data-card-body">
                        {cursos.length === 0 ? (
                            <Alert variant="info">No estás asignado a ningún curso.</Alert>
                        ) : (
                            <Table striped bordered hover responsive className="data-table">
                                <thead className="table-header">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre del Curso</th>
                                        <th>Descripción</th>
                                        <th>Duración (hrs)</th>
                                        <th>Horario</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cursos.map(curso => (
                                        <tr key={curso.id}>
                                            <td>{curso.id}</td>
                                            <td>{curso.nombre}</td>
                                            <td>{curso.descripcion}</td>
                                            <td>{curso.duracion}</td>
                                            <td>{curso.horario}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="me-2 action-button"
                                                    onClick={() => handleViewStudents(curso)}
                                                >
                                                    <i className="fas fa-users me-1"></i>
                                                    Ver Estudiantes
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="action-button"
                                                    onClick={() => handleAttendance(curso)}
                                                >
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    Tomar Asistencia
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>

                {/* Modal para ver estudiantes y notas */}
                <Modal show={showStudentsModal} onHide={() => setShowStudentsModal(false)} size="xl" centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title className="modal-title-custom">
                            <i className="fas fa-user-graduate me-2"></i>
                            Estudiantes en {selectedCourse?.nombre}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {studentsInCourse.length === 0 ? (
                            <Alert variant="info">No hay estudiantes inscritos en este curso.</Alert>
                        ) : (
                            <Table striped bordered hover responsive className="data-table">
                                <thead className="table-header">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Notas</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsInCourse.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.nombre} {student.apellido}</td>
                                            <td>{student.email}</td>
                                            <td>
                                                {student.notas && student.notas.length > 0 ? (
                                                    <ul className="list-unstyled mb-0">
                                                        {student.notas.map(nota => (
                                                            <li key={nota.id}>
                                                                <Badge bg="primary" className="me-1">
                                                                    {nota.tipo}
                                                                </Badge>
                                                                <span className="fw-bold">{nota.calificacion}</span> - {nota.descripcion} ({format(new Date(nota.fechaRegistro), 'dd/MM/yyyy')})
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    className="ms-2 action-button-sm"
                                                                    onClick={() => handleAssignNota(student, nota)}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <Badge bg="secondary">Sin notas</Badge>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    className="action-button"
                                                    onClick={() => handleAssignNota(student)}
                                                >
                                                    <i className="fas fa-plus me-1"></i>
                                                    Asignar/Editar Nota
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowStudentsModal(false)}>
                            <i className="fas fa-times me-2"></i>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para asignar/editar nota */}
                <Modal show={showNotaModal} onHide={() => setShowNotaModal(false)} centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title className="modal-title-custom">
                            <i className="fas fa-clipboard-check me-2"></i>
                            {editNotaId ? 'Editar Nota' : 'Asignar Nota'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {currentStudent && (
                            <p className="mb-3">
                                <span className="fw-bold">Estudiante:</span> {currentStudent.nombre} {currentStudent.apellido}
                                <br />
                                <span className="fw-bold">Curso:</span> {selectedCourse?.nombre}
                            </p>
                        )}
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-label-custom">
                                    <i className="fas fa-star me-2"></i>
                                    Calificación (0.0 - 5.0)
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    min="0.0"
                                    max="5.0"
                                    value={notaForm.valor}
                                    onChange={(e) => setNotaForm({ ...notaForm, valor: e.target.value })}
                                    className="form-control-custom"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-label-custom">
                                    <i className="fas fa-tag me-2"></i>
                                    Tipo de Nota
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={notaForm.tipo}
                                    onChange={(e) => setNotaForm({ ...notaForm, tipo: e.target.value })}
                                    placeholder="Ej: Parcial 1, Tarea, Examen Final"
                                    className="form-control-custom"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-label-custom">
                                    <i className="fas fa-align-left me-2"></i>
                                    Descripción
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={notaForm.descripcion}
                                    onChange={(e) => setNotaForm({ ...notaForm, descripcion: e.target.value })}
                                    className="form-control-custom"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-label-custom">
                                    <i className="fas fa-calendar-alt me-2"></i>
                                    Fecha de Registro
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={notaForm.fecha}
                                    onChange={(e) => setNotaForm({ ...notaForm, fecha: e.target.value })}
                                    className="form-control-custom"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowNotaModal(false)}>
                            <i className="fas fa-times me-2"></i>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveNota}>
                            <i className="fas fa-save me-2"></i>
                            Guardar Nota
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para tomar asistencia */}
                <Modal show={showAttendanceModal} onHide={() => setShowAttendanceModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title className="modal-title-custom">
                            <i className="fas fa-calendar-check me-2"></i>
                            Tomar Asistencia para {selectedCourse?.nombre}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        <Form.Group className="mb-3">
                            <Form.Label className="form-label-custom">
                                <i className="fas fa-calendar-day me-2"></i>
                                Fecha de Asistencia
                            </Form.Label>
                            <Form.Control
                                type="date"
                                value={attendanceDate}
                                onChange={handleAttendanceDateChange}
                                className="form-control-custom"
                            />
                        </Form.Group>
                        {currentAttendanceList.length === 0 ? (
                            <Alert variant="info">No hay estudiantes para tomar asistencia.</Alert>
                        ) : (
                            <Table striped bordered hover responsive className="data-table">
                                <thead className="table-header">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Estudiante</th>
                                        <th className="text-center">Presente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAttendanceList.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.nombre} {student.apellido}</td>
                                            <td className="text-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={attendanceData[student.id] || false}
                                                    onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                                                    className="d-inline-block"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowAttendanceModal(false)}>
                            <i className="fas fa-times me-2"></i>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveAttendance}>
                            <i className="fas fa-save me-2"></i>
                            Guardar Asistencia
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default PanelProfesor;