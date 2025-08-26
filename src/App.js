// App.js - Router principal con menú lateral basado en mockups (PDF páginas 9-14).
// Cumple mapa de navegación (páginas 3-5), usabilidad (navegación constante) y accesibilidad (focus states).
// Estructura: Sidebar fijo, contenido dinámico.

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicamentos from './pages/Medicamentos';
import NuevaCompra from './pages/NuevaCompra';
import NuevaVenta from './pages/NuevaVenta';
import Reportes from './pages/Reportes';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '250px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/nueva-compra" element={<NuevaCompra />} />
            <Route path="/nueva-venta" element={<NuevaVenta />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
export default NuevaCompra;
export default NuevaVenta;