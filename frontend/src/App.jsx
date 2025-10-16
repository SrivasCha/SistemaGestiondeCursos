// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout'; // Tu componente de Dashboard/Layout

// Importa todas las páginas
import DashboardPage from './pages/Dashboard'; 
import ClientesPage from './pages/ClientesPage';
import EmpleadosPage from './pages/EmpleadosPage';
import DistribuidorasPage from './pages/DistribuidorasPage';
import TarifasPage from './pages/TarifasPage';
import PeliculasPage from './pages/PeliculasPage';
import CopiasPage from './pages/CopiasPage';
import AlquileresPage from './pages/AlquileresPage'; 
import TrailersPage from './pages/TrailersPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/*
          El Layout envuelve TODAS las rutas CRUD/Dashboard.
          Todas las rutas internas (incluida la de tráilers) se cargan dentro del Layout.
        */}
        <Route path="/" element={<Layout />}>
          
          {/* Dashboard (Ruta índice. Se muestra en '/') */}
          <Route index element={<DashboardPage />} /> 

          {/* Rutas CRUD */}
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="empleados" element={<EmpleadosPage />} />
          <Route path="distribuidoras" element={<DistribuidorasPage />} />
          <Route path="tarifas" element={<TarifasPage />} />
          <Route path="peliculas" element={<PeliculasPage />} />
          <Route path="copias" element={<CopiasPage />} />
          <Route path="alquileres" element={<AlquileresPage />} />

          {/* 👈 RUTA NUEVA: Se accede a través de /trailers */}
          <Route path="trailers" element={<TrailersPage />} /> 

          {/* Manejo de ruta no encontrada */}
          <Route path="*" element={
              <div className="container mt-5 text-center">
                  <h1>404 - Página no encontrada</h1>
                  <p>La URL solicitada no existe en el sistema.</p>
              </div>
          } />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;