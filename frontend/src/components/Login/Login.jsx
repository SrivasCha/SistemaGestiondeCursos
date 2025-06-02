// src/components/Auth/Login.jsx

import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/Login.css'; // ¡Importa tu nuevo archivo CSS!

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      Swal.fire('Bienvenido', `Rol: ${res.rol}`, 'success');
      if (res.rol === 'ADMIN') navigate('/admin');
      else if (res.rol === 'PROFESOR') navigate('/profesor');
      else if (res.rol === 'ESTUDIANTE') navigate('/estudiante');
    } catch (error) {
      // Puedes ser más específico con el mensaje de error si el backend lo proporciona
      console.error("Error de login:", error);
      Swal.fire('Error', 'Credenciales inválidas. Por favor, verifica tu email y contraseña.', 'error');
    }
  };

  return (
    <div className="login-page"> {/* Clase para el fondo y centrado */}
      <div className="login-container"> {/* Contenedor principal del formulario */}
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group"> {/* Grupo para cada campo */}
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="login-input" /* Clase de input personalizada */
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              className="login-input" /* Clase de input personalizada */
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button"> {/* Clase de botón personalizada */}
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;