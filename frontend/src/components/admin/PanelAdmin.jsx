import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Badge, Card } from "react-bootstrap";
import api from "../../services/api";
import { getToken, getRol, logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import '../../styles/PanelAdmin.css'; // Importar estilos personalizados
import { toast } from 'react-toastify'; // Asegúrate de importar toast si lo usas

const PanelAdmin = () => {
  const [users, setUsers] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", duracion: "", horario: "" });
  const [editFormData, setEditFormData] = useState({ id: null, nombre: "", duracion: "", horario: "" });
  const [newUserData, setNewUserData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "ESTUDIANTE",
    // Nuevos campos para Estudiante y Profesor
    apellido: "",
    especialidad: "", // Para Profesor
    numeroIdentificacion: "", // Para Estudiante
    direccion: "", // Para Estudiante
    telefono: "", // Para Estudiante
    fechaNacimiento: "", // Para Estudiante (formato YYYY-MM-DD)
    fotoPerfil: "", // Para Estudiante (URL o base64 si manejas subidas directas, por ahora solo URL)
    cursosIds: [], // Para Profesor (lista de IDs de cursos seleccionados)
  });
  const [error, setError] = useState("");
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setRol(getRol());
  }, []);

  const fetchData = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const usersResponse = await api.get("api/admin/usuarios", config);
      const cursosResponse = await api.get("api/curso", config);
      setUsers(usersResponse.data);
      setCursos(cursosResponse.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error cargando datos. " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCurso = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.post("api/curso", formData, config);
      setShowModal(false);
      setFormData({ nombre: "", duracion: "", horario: "" });
      fetchData();
      toast.success("Curso creado exitosamente!");
    } catch (error) {
      console.error("Error creando curso:", error);
      setError("Error creando curso. " + (error.response?.data?.message || error.message));
      toast.error("Error creando curso.");
    }
  };

  const handleEditClick = (curso) => {
    setEditFormData(curso);
    setShowEditModal(true);
  };

  const handleUpdateCurso = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`api/curso/${editFormData.id}`, editFormData, config);
      setShowEditModal(false);
      setEditFormData({ id: null, nombre: "", duracion: "", horario: "" });
      fetchData();
      toast.success("Curso actualizado exitosamente!");
    } catch (error) {
      console.error("Error actualizando curso:", error);
      setError("Error actualizando curso. " + (error.response?.data?.message || error.message));
      toast.error("Error actualizando curso.");
    }
  };

  const handleDeleteCurso = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`api/curso/${id}`, config);
      fetchData();
      toast.success("Curso eliminado exitosamente!");
    } catch (error) {
      console.error("Error eliminando curso:", error);
      setError("Error eliminando curso. " + (error.response?.data?.message || error.message));
      toast.error("Error eliminando curso.");
    }
  };


  const handleCreateUser = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Adaptar los datos según el rol
      let userDataToSend = { ...newUserData };
      if (userDataToSend.rol === "ESTUDIANTE") {
        delete userDataToSend.especialidad;
        delete userDataToSend.cursosIds;
      } else if (userDataToSend.rol === "PROFESOR") {
        delete userDataToSend.numeroIdentificacion;
        delete userDataToSend.direccion;
        delete userDataToSend.telefono;
        delete userDataToSend.fechaNacimiento;
        delete userDataToSend.fotoPerfil;
      } else if (userDataToSend.rol === "ADMIN") {
        // Los administradores no necesitan los campos adicionales de estudiante o profesor
        delete userDataToSend.apellido;
        delete userDataToSend.especialidad;
        delete userDataToSend.numeroIdentificacion;
        delete userDataToSend.direccion;
        delete userDataToSend.telefono;
        delete userDataToSend.fechaNacimiento;
        delete userDataToSend.fotoPerfil;
        delete userDataToSend.cursosIds;
      }

      await api.post("api/auth/register", userDataToSend, config);
      setShowUserModal(false);
      setNewUserData({ nombre: "", email: "", password: "", rol: "ESTUDIANTE", apellido: "", especialidad: "", numeroIdentificacion: "", direccion: "", telefono: "", fechaNacimiento: "", fotoPerfil: "", cursosIds: [] });
      fetchData();
      toast.success("Usuario creado exitosamente!");
    } catch (error) {
      console.error("Error creando usuario:", error);
      setError("Error creando usuario. " + (error.response?.data?.message || error.message));
      toast.error("Error creando usuario.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="admin-panel-bg">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="admin-header-card shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="admin-icon me-3">
                      <i className="fas fa-user-shield"></i>
                    </div>
                    <div>
                      <h2 className="mb-0 admin-title">Panel de Administrador</h2>
                      <p className="mb-0">Gestión de usuarios y cursos</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge bg="primary" className="me-3 px-3 py-2 admin-badge">
                      <i className="fas fa-user me-2"></i>
                      {rol}
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

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" className="custom-alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="stats-card stats-users">
              <Card.Body className="text-center">
                <div className="stats-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="stats-number">{users.length}</h3>
                <p className="stats-label">Usuarios Registrados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stats-card stats-courses">
              <Card.Body className="text-center">
                <div className="stats-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3 className="stats-number">{cursos.length}</h3>
                <p className="stats-label">Cursos Disponibles</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Users Section */}
        <Row className="mb-4">
          <Col>
            <Card className="data-card shadow-sm">
              <Card.Header className="card-header-custom">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-users me-2"></i>
                    <h4 className="mb-0">Usuarios Registrados</h4>
                  </div>
                  <Button 
                    variant="primary" 
                    className="create-btn"
                    onClick={() => setShowUserModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Crear Usuario
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="modern-table mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <span className="id-badge">#{user.id}</span>
                          </td>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {user.nombre.charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-medium">{user.nombre}</span>
                            </div>
                          </td>
                          <td className="text-muted">{user.email}</td>
                          <td>
                            <Badge 
                              bg={
                                user.rol === "ADMIN" ? "danger" :
                                user.rol === "PROFESOR" ? "warning" : "success"
                              }
                              className="role-badge"
                            >
                              <i className={`fas ${
                                user.rol === "ADMIN" ? "fa-user-shield" :
                                user.rol === "PROFESOR" ? "fa-chalkboard-teacher" : "fa-user-graduate"
                              } me-1`}></i>
                              {user.rol}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Courses Section */}
        <Row>
          <Col>
            <Card className="data-card shadow-sm">
              <Card.Header className="card-header-custom">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-graduation-cap me-2"></i>
                    <h4 className="mb-0">Cursos Disponibles</h4>
                  </div>
                  <Button 
                    variant="success" 
                    className="create-btn"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Crear Curso
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="modern-table mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Duración</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cursos.map((curso) => (
                        <tr key={curso.id}>
                          <td>
                            <span className="id-badge">#{curso.id}</span>
                          </td>
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
                          <td>
                            <div className="action-buttons">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="action-btn me-2"
                                onClick={() => handleEditClick(curso)}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="action-btn"
                                onClick={() => handleDeleteCurso(curso.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Crear Curso */}
        <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>
              <i className="fas fa-plus-circle me-2"></i>
              Nuevo Curso
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-book me-2"></i>
                  Nombre del Curso
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  placeholder="Ingrese el nombre del curso"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-clock me-2"></i>
                  Duración (horas)
                </Form.Label>
                <Form.Control
                  type="number"
                  className="form-control-custom"
                  placeholder="Duración en horas"
                  value={formData.duracion}
                  onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-calendar me-2"></i>
                  Horario
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  placeholder="Ej: Lunes a Viernes 9:00-12:00"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleCreateCurso}>
              <i className="fas fa-save me-2"></i>
              Guardar Curso
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Editar Curso */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>
              <i className="fas fa-edit me-2"></i>
              Editar Curso
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-book me-2"></i>
                  Nombre del Curso
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  value={editFormData.nombre}
                  onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-clock me-2"></i>
                  Duración (horas)
                </Form.Label>
                <Form.Control
                  type="number"
                  className="form-control-custom"
                  value={editFormData.duracion}
                  onChange={(e) => setEditFormData({ ...editFormData, duracion: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-calendar me-2"></i>
                  Horario
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  value={editFormData.horario}
                  onChange={(e) => setEditFormData({ ...editFormData, horario: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleUpdateCurso}>
              <i className="fas fa-save me-2"></i>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Crear Usuario */}
        <Modal show={showUserModal} onHide={() => setShowUserModal(false)} className="custom-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>
              <i className="fas fa-user-plus me-2"></i>
              Nuevo Usuario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-user me-2"></i>
                  Nombre
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  placeholder="Ingrese el nombre"
                  value={newUserData.nombre}
                  onChange={(e) => setNewUserData({ ...newUserData, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-user me-2"></i>
                  Apellido
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-custom"
                  placeholder="Ingrese el apellido"
                  value={newUserData.apellido}
                  onChange={(e) => setNewUserData({ ...newUserData, apellido: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-envelope me-2"></i>
                  Correo Electrónico
                </Form.Label>
                <Form.Control
                  type="email"
                  className="form-control-custom"
                  placeholder="correo@ejemplo.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-lock me-2"></i>
                  Contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  className="form-control-custom"
                  placeholder="Contraseña segura"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <i className="fas fa-user-tag me-2"></i>
                  Rol del Usuario
                </Form.Label>
                <Form.Select
                  className="form-control-custom"
                  value={newUserData.rol}
                  onChange={(e) => setNewUserData({ ...newUserData, rol: e.target.value })}
                >
                  <option value="ESTUDIANTE">👨‍🎓 Estudiante</option>
                  <option value="PROFESOR">👨‍🏫 Profesor</option>
                  <option value="ADMIN">👨‍💼 Administrador</option>
                </Form.Select>
              </Form.Group>

              {newUserData.rol === "ESTUDIANTE" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-id-card me-2"></i>
                      Número de Identificación
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      placeholder="Ingrese número de identificación"
                      value={newUserData.numeroIdentificacion}
                      onChange={(e) => setNewUserData({ ...newUserData, numeroIdentificacion: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Dirección
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      placeholder="Ingrese la dirección"
                      value={newUserData.direccion}
                      onChange={(e) => setNewUserData({ ...newUserData, direccion: e.target.value })}
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
                      placeholder="Ingrese el número de teléfono"
                      value={newUserData.telefono}
                      onChange={(e) => setNewUserData({ ...newUserData, telefono: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-calendar-alt me-2"></i>
                      Fecha de Nacimiento
                    </Form.Label>
                    <Form.Control
                      type="date"
                      className="form-control-custom"
                      value={newUserData.fechaNacimiento}
                      onChange={(e) => setNewUserData({ ...newUserData, fechaNacimiento: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-image me-2"></i>
                      URL Foto de Perfil
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      placeholder="URL de la foto de perfil"
                      value={newUserData.fotoPerfil}
                      onChange={(e) => setNewUserData({ ...newUserData, fotoPerfil: e.target.value })}
                    />
                  </Form.Group>
                </>
              )}

              {newUserData.rol === "PROFESOR" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-flask me-2"></i>
                      Especialidad
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-custom"
                      placeholder="Ingrese la especialidad"
                      value={newUserData.especialidad}
                      onChange={(e) => setNewUserData({ ...newUserData, especialidad: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="fas fa-book-reader me-2"></i>
                      Cursos Asignados
                    </Form.Label>
                    <Form.Select
                      multiple
                      className="form-control-custom"
                      value={newUserData.cursosIds}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                        setNewUserData({ ...newUserData, cursosIds: selectedOptions });
                      }}
                    >
                      {cursos.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Selecciona uno o más cursos.
                    </Form.Text>
                  </Form.Group>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              <i className="fas fa-user-plus me-2"></i>
              Crear Usuario
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PanelAdmin;