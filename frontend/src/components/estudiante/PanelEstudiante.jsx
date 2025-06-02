import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Badge, Card, Nav, Tab } from "react-bootstrap";
import api from "../../services/api";
import { getToken, getRol, logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import '../../styles/PanelEstudiante.css';

const PanelEstudiante = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [estudiante, setEstudiante] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [notas, setNotas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMatricularModal, setShowMatricularModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    fotoPerfil: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarPerfil(),
        cargarCursos(),
        cargarCursosDisponibles(),
        cargarNotas(),
        cargarEstadisticas()
      ]);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error cargando los datos del estudiante");
    } finally {
      setLoading(false);
    }
  };

  const cargarPerfil = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/api/estudiante/perfil", config);
      setEstudiante(response.data);
      setEditFormData({
        nombre: response.data.nombre || "",
        apellido: response.data.apellido || "",
        direccion: response.data.direccion || "",
        telefono: response.data.telefono || "",
        fotoPerfil: response.data.fotoPerfil || ""
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };

  const cargarCursos = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/api/estudiante/mis-cursos", config);
      setCursos(response.data);
    } catch (error) {
      console.error("Error cargando cursos:", error);
    }
  };

  const cargarCursosDisponibles = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/api/estudiante/cursos-disponibles", config);
      setCursosDisponibles(response.data);
    } catch (error) {
      console.error("Error cargando cursos disponibles:", error);
    }
  };

  const cargarNotas = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/api/estudiante/mis-notas", config);
      setNotas(response.data);
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/api/estudiante/estadisticas", config);
      setEstadisticas(response.data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const handleUpdatePerfil = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put("/api/estudiante/perfil", editFormData, config);
      setShowEditModal(false);
      setSuccess("Perfil actualizado exitosamente");
      await cargarPerfil();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setError("Error actualizando el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleMatricular = async (cursoId) => {
    try {
      setLoading(true);
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post(`/api/estudiante/matricular/${cursoId}`, {}, config);
      
      if (response.data.status === "success") {
        setSuccess(response.data.mensaje);
        await Promise.all([cargarCursos(), cargarCursosDisponibles(), cargarEstadisticas()]);
      } else {
        setError(response.data.mensaje);
      }
    } catch (error) {
      console.error("Error matriculando:", error);
      setError("Error al matricularse en el curso");
    } finally {
      setLoading(false);
    }
  };

  const handleDesmatricular = async (cursoId) => {
    if (!window.confirm("¿Estás seguro de que quieres desmatricularte de este curso?")) return;
    
    try {
      setLoading(true);
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.delete(`/api/estudiante/desmatricular/${cursoId}`, config);
      
      if (response.data.status === "success") {
        setSuccess(response.data.mensaje);
        await Promise.all([cargarCursos(), cargarCursosDisponibles(), cargarEstadisticas()]);
      } else {
        setError(response.data.mensaje);
      }
    } catch (error) {
      console.error("Error desmatriculando:", error);
      setError("Error al desmatricularse del curso");
    } finally {
      setLoading(false);
    }
  };

  const generarReportePDF = () => {
    // Implementación futura para generar PDF
    setSuccess("Función de reporte PDF próximamente disponible");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  const limpiarAlertas = () => {
    setError("");
    setSuccess("");
  };

  if (loading && !estudiante) {
    return (
      <div className="estudiante-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin fa-3x text-primary"></i>
          <p className="mt-3">Cargando panel de estudiante...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estudiante-panel-bg">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="estudiante-header-card shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="estudiante-avatar me-3">
                      {estudiante?.fotoPerfil ? (
                        <img 
                          src={estudiante.fotoPerfil} 
                          alt="Foto de perfil" 
                          className="avatar-img"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          <i className="fas fa-user-graduate"></i>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="mb-0 estudiante-title">
                        Bienvenido, {estudiante?.nombre} {estudiante?.apellido}
                      </h2>
                      <p className="mb-0 text-muted">Panel de Estudiante</p>
                      {estadisticas.promedio && (
                        <Badge bg="success" className="mt-2">
                          <i className="fas fa-star me-1"></i>
                          Promedio: {estadisticas.promedio.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge bg="info" className="me-3 px-3 py-2">
                      <i className="fas fa-user-graduate me-2"></i>
                      ESTUDIANTE
                    </Badge>
                    <Button 
                      variant="outline-danger" 
                      className="logout-btn"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alertas */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" dismissible onClose={limpiarAlertas}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {success && (
          <Row className="mb-4">
            <Col>
              <Alert variant="success" dismissible onClose={limpiarAlertas}>
                <i className="fas fa-check-circle me-2"></i>
                {success}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card stats-cursos">
              <Card.Body className="text-center">
                <div className="stats-icon">
                  <i className="fas fa-book"></i>
                </div>
                <h3 className="stats-number">{estadisticas.totalCursos || 0}</h3>
                <p className="stats-label">Cursos Matriculados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card stats-notas">
              <Card.Body className="text-center">
                <div className="stats-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <h3 className="stats-number">{estadisticas.totalNotas || 0}</h3>
                <p className="stats-label">Calificaciones</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card stats-promedio">
              <Card.Body className="text-center">
                <div className="stats-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="stats-number">
                  {estadisticas.promedio ? estadisticas.promedio.toFixed(2) : "0.00"}
                </h3>
                <p className="stats-label">Promedio General</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card stats-disponibles">
              <Card.Body className="text-center">
                <div className="stats-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <h3 className="stats-number">{cursosDisponibles.length}</h3>
                <p className="stats-label">Cursos Disponibles</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content with Tabs */}
        <Row>
          <Col>
            <Card className="data-card shadow-sm">
              <Card.Header className="card-header-custom">
                <Nav variant="tabs" className="nav-tabs-custom">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === "perfil"} 
                      onClick={() => setActiveTab("perfil")}
                      className="tab-link"
                    >
                      <i className="fas fa-user me-2"></i>
                      Mi Perfil
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === "cursos"} 
                      onClick={() => setActiveTab("cursos")}
                      className="tab-link"
                    >
                      <i className="fas fa-book me-2"></i>
                      Mis Cursos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === "matricular"} 
                      onClick={() => setActiveTab("matricular")}
                      className="tab-link"
                    >
                      <i className="fas fa-plus me-2"></i>
                      Matricular Cursos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === "notas"} 
                      onClick={() => setActiveTab("notas")}
                      className="tab-link"
                    >
                      <i className="fas fa-clipboard-list me-2"></i>
                      Mis Calificaciones
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === "horario"} 
                      onClick={() => setActiveTab("horario")}
                      className="tab-link"
                    >
                      <i className="fas fa-calendar me-2"></i>
                      Mi Horario
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="tab-content-custom">
                  {/* Tab Perfil */}
                  {activeTab === "perfil" && (
                    <div className="tab-pane-custom p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4><i className="fas fa-user me-2 text-primary"></i>Información Personal</h4>
                        <Button 
                          variant="primary" 
                          onClick={() => setShowEditModal(true)}
                          className="btn-rounded"
                        >
                          <i className="fas fa-edit me-2"></i>
                          Editar Perfil
                        </Button>
                      </div>
                      
                      <Row>
                        <Col md={4} className="text-center mb-4">
                          <div className="profile-photo-section">
                            {estudiante?.fotoPerfil ? (
                              <img 
                                src={estudiante.fotoPerfil} 
                                alt="Foto de perfil" 
                                className="profile-photo"
                              />
                            ) : (
                              <div className="profile-photo-placeholder">
                                <i className="fas fa-user-graduate fa-4x"></i>
                              </div>
                            )}
                            <p className="mt-3 text-muted">Foto de Perfil</p>
                          </div>
                        </Col>
                        <Col md={8}>
                          <div className="profile-info">
                            <div className="info-group">
                              <label className="info-label">
                                <i className="fas fa-user me-2"></i>Nombre Completo
                              </label>
                              <p className="info-value">
                                {estudiante?.nombre} {estudiante?.apellido}
                              </p>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">
                                <i className="fas fa-envelope me-2"></i>Correo Electrónico
                              </label>
                              <p className="info-value">{estudiante?.email}</p>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">
                                <i className="fas fa-map-marker-alt me-2"></i>Dirección
                              </label>
                              <p className="info-value">
                                {estudiante?.direccion || "No especificada"}
                              </p>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">
                                <i className="fas fa-phone me-2"></i>Teléfono
                              </label>
                              <p className="info-value">
                                {estudiante?.telefono || "No especificado"}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Tab Mis Cursos */}
                  {activeTab === "cursos" && (
                    <div className="tab-pane-custom">
                      <div className="table-header p-4 pb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h4><i className="fas fa-book me-2 text-primary"></i>Mis Cursos Matriculados</h4>
                          <Badge bg="info">{cursos.length} curso(s) matriculado(s)</Badge>
                        </div>
                      </div>
                      
                      <div className="table-responsive">
                        <Table className="modern-table mb-0">
                          <thead>
                            <tr>
                              <th>Curso</th>
                              <th>Duración</th>
                              <th>Horario</th>
                              <th>Profesor</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cursos.length > 0 ? (
                              cursos.map((curso) => (
                                <tr key={curso.id}>
                                  <td>
                                    <div className="course-info">
                                      <i className="fas fa-book-open me-2 text-primary"></i>
                                      <span className="fw-medium">{curso.nombre}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge bg="info" className="duration-badge">
                                      <i className="fas fa-clock me-1"></i>
                                      {curso.duracion} horas
                                    </Badge>
                                  </td>
                                  <td className="text-muted">
                                    <i className="fas fa-calendar me-1"></i>
                                    {curso.horario}
                                  </td>
                                  <td className="text-muted">
                                    <i className="fas fa-chalkboard-teacher me-1"></i>
                                    {curso.profesor}
                                  </td>
                                  <td>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm" 
                                      onClick={() => handleDesmatricular(curso.id)}
                                      className="action-btn"
                                      disabled={loading}
                                    >
                                      <i className="fas fa-user-minus"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-5">
                                  <div className="empty-state">
                                    <i className="fas fa-book fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No tienes cursos matriculados aún</p>
                                    <Button 
                                      variant="primary" 
                                      onClick={() => setActiveTab("matricular")}
                                    >
                                      Matricular Cursos
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {/* Tab Matricular Cursos */}
                  {activeTab === "matricular" && (
                    <div className="tab-pane-custom">
                      <div className="table-header p-4 pb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h4><i className="fas fa-plus me-2 text-success"></i>Cursos Disponibles</h4>
                          <Badge bg="success">{cursosDisponibles.length} curso(s) disponible(s)</Badge>
                        </div>
                      </div>
                      
                      <div className="table-responsive">
                        <Table className="modern-table mb-0">
                          <thead>
                            <tr>
                              <th>Curso</th>
                              <th>Duración</th>
                              <th>Horario</th>
                              <th>Profesor</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cursosDisponibles.length > 0 ? (
                              cursosDisponibles.map((curso) => (
                                <tr key={curso.id}>
                                  <td>
                                    <div className="course-info">
                                      <i className="fas fa-book-open me-2 text-success"></i>
                                      <span className="fw-medium">{curso.nombre}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge bg="info" className="duration-badge">
                                      <i className="fas fa-clock me-1"></i>
                                      {curso.duracion} horas
                                    </Badge>
                                  </td>
                                  <td className="text-muted">
                                    <i className="fas fa-calendar me-1"></i>
                                    {curso.horario}
                                  </td>
                                  <td className="text-muted">
                                    <i className="fas fa-chalkboard-teacher me-1"></i>
                                    {curso.profesor?.nombre || "Sin asignar"}
                                  </td>
                                  <td>
                                    <Button 
                                      variant="outline-success" 
                                      size="sm" 
                                      onClick={() => handleMatricular(curso.id)}
                                      className="action-btn"
                                      disabled={loading}
                                    >
                                      <i className="fas fa-user-plus"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-5">
                                  <div className="empty-state">
                                    <i className="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No hay cursos disponibles para matricular</p>
                                    <p className="text-muted">Ya estás matriculado en todos los cursos disponibles</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {/* Tab Calificaciones */}
                  {activeTab === "notas" && (
                    <div className="tab-pane-custom">
                      <div className="table-header p-4 pb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h4><i className="fas fa-clipboard-list me-2 text-warning"></i>Mis Calificaciones</h4>
                          <div>
                            <Badge bg="warning" className="me-2">
                              {notas.length} calificación(es)
                            </Badge>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={generarReportePDF}
                            >
                              <i className="fas fa-file-pdf me-2"></i>
                              Generar PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-responsive">
                        <Table className="modern-table mb-0">
                          <thead>
                            <tr>
                              <th>Curso</th>
                              <th>Tipo</th>
                              <th>Descripción</th>
                              <th>Calificación</th>
                              <th>Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {notas.length > 0 ? (
                              notas.map((nota) => (
                                <tr key={nota.id}>
                                  <td>
                                    <div className="course-info">
                                      <i className="fas fa-book me-2 text-primary"></i>
                                      <span className="fw-medium">{nota.curso}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge 
                                      bg={
                                        nota.tipo === "FINAL" ? "danger" :
                                        nota.tipo === "PARCIAL" ? "warning" : "info"
                                      }
                                      className="type-badge"
                                    >
                                      {nota.tipo || "EVALUACIÓN"}
                                    </Badge>
                                  </td>
                                  <td className="text-muted">
                                    {nota.descripcion || "Sin descripción"}
                                  </td>
                                  <td>
                                    <Badge 
                                      bg={
                                        nota.calificacion >= 4.0 ? "success" :
                                        nota.calificacion >= 3.0 ? "warning" : "danger"
                                      }
                                      className="grade-badge"
                                    >
                                      <i className="fas fa-star me-1"></i>
                                      {nota.calificacion.toFixed(1)}
                                    </Badge>
                                  </td>
                                  <td className="text-muted">
                                    <i className="fas fa-calendar me-1"></i>
                                    {nota.fechaRegistro ? 
                                      new Date(nota.fechaRegistro).toLocaleDateString() : 
                                      "No especificada"
                                    }
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-5">
                                  <div className="empty-state">
                                    <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No tienes calificaciones registradas aún</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {/* Tab Horario */}
                  {activeTab === "horario" && (
                    <div className="tab-pane-custom p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4><i className="fas fa-calendar me-2 text-info"></i>Mi Horario Semanal</h4>
                        <Badge bg="info">{cursos.length} curso(s) programado(s)</Badge>
                      </div>
                      
                      <div className="schedule-container">
                        <Row>
                          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(dia => (
                            <Col key={dia} md={12} lg={6} xl={4} className="mb-3">
                              <Card className="schedule-day-card">
                                <Card.Header className="schedule-day-header">
                                  <h6 className="mb-0">
                                    <i className="fas fa-calendar-day me-2"></i>
                                    {dia}
                                  </h6>
                                </Card.Header>
                                <Card.Body className="schedule-day-body">
                                  {cursos.filter(curso => 
                                    curso.horario && curso.horario.toLowerCase().includes(dia.toLowerCase())
                                  ).length > 0 ? (
                                    cursos
                                      .filter(curso => 
                                        curso.horario && curso.horario.toLowerCase().includes(dia.toLowerCase())
                                      )
                                      .map(curso => (
                                        <div key={curso.id} className="schedule-item">
                                          <div className="schedule-course">
                                            <i className="fas fa-book me-2 text-primary"></i>
                                            <strong>{curso.nombre}</strong>
                                          </div>
                                          <div className="schedule-time">
                                            <i className="fas fa-clock me-1 text-muted"></i>
                                            <small className="text-muted">{curso.horario}</small>
                                          </div>
                                          <div className="schedule-teacher">
                                            <i className="fas fa-user me-1 text-muted"></i>
                                            <small className="text-muted">{curso.profesor}</small>
                                          </div>
                                        </div>
                                      ))
                                  ) : (
                                    <div className="no-classes">
                                      <i className="fas fa-coffee text-muted"></i>
                                      <small className="text-muted ms-2">Sin clases</small>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Editar Perfil */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>
              <i className="fas fa-edit me-2"></i>
              Editar Mi Perfil
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-user me-2"></i>
                      Nombre
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      value={editFormData.nombre}
                      onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-user me-2"></i>
                      Apellido
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      value={editFormData.apellido}
                      onChange={(e) => setEditFormData({ ...editFormData, apellido: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Dirección
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  placeholder="Ingresa tu dirección"
                  value={editFormData.direccion}
                  onChange={(e) => setEditFormData({ ...editFormData, direccion: e.target.value })}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-phone me-2"></i>
                  Teléfono
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  placeholder="Ingresa tu teléfono"
                  value={editFormData.telefono}
                  onChange={(e) => setEditFormData({ ...editFormData, telefono: e.target.value })}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-image me-2"></i>
                  URL Foto de Perfil (Opcional)
                </Form.Label>
                <Form.Control
                  type="url"
                  className="form-control-custom"
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  value={editFormData.fotoPerfil}
                  onChange={(e) => setEditFormData({ ...editFormData, fotoPerfil: e.target.value })}
                />
                <Form.Text className="text-muted">
                  Ingresa la URL de tu foto de perfil. Debe ser una imagen válida.
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdatePerfil} disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Guardar Cambios
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PanelEstudiante;
