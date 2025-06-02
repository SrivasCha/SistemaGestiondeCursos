import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import PanelAdmin from './components/admin/PanelAdmin';
import PanelProfesor from './components/profesor/PanelProfesor';
import PanelEstudiante from './components/estudiante/PanelEstudiante';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/profesor" element={<PanelProfesor />} />
          <Route path="/estudiante" element={<PanelEstudiante />} />
        </Route>
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

