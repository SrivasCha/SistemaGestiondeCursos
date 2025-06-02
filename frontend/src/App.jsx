import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import PanelAdmin from './components/admin/PanelAdmin';
import PanelProfesor from './components/profesor/PanelProfesor';
import PanelEstudiante from './components/estudiante/PanelEstudiante';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/profesor" element={<PanelProfesor />} />
        <Route path="/estudiante" element={<PanelEstudiante />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
