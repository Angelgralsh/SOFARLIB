// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicamentos from './pages/Medicamentos';
import Compras from './pages/Compras';
import NuevaVenta from './pages/NuevaVenta';
import LotesDisponibles from './pages/LotesDisponibles';
import Invoice from './pages/Invoice';

function isLogged() {
  try { 
    const user = localStorage.getItem('usuario');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return !!(user && isLoggedIn === 'true' && JSON.parse(user));
  }
  catch { 
    return false; 
  }
}

function RequireAuth({ children }) {
  const loc = useLocation();
  return isLogged() ? children : <Navigate to="/login" replace state={{ from: loc }} />;
}

function Sidebar() {
  const location = useLocation();
  
  // NO mostrar sidebar en la página de login
  if (!isLogged() || location.pathname === '/login') return null;
  
  const link = { 
    display: 'block', 
    padding: '10px 12px', 
    borderRadius: 8, 
    textDecoration: 'none', 
    color: '#173a5e',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left'
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('isLoggedIn');
    localStorage.clear(); // Limpia todo por si acaso
    
    // Redirigir al login
    window.location.hash = '#/login';
    window.location.reload();
  };

  // Obtener datos del usuario
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch (e) {
    console.error('Error parseando usuario:', e);
    handleLogout(); // Si hay error, hacer logout
    return null;
  }

  // Si no hay usuario válido, hacer logout
  if (!usuario || !usuario.nombre) {
    handleLogout();
    return null;
  }

  return (
    <aside style={{ 
      width: 250, 
      padding: 16, 
      borderRight: '1px solid #e5e5e5', 
      height: '100vh', 
      position: 'sticky', 
      top: 0,
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>SOFARLIB</h3>
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          padding: '8px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <div><strong>{usuario.nombre}</strong></div>
          <div style={{ fontSize: '10px' }}>{usuario.email}</div>
          <div style={{ color: '#007bff', fontWeight: 'bold' }}>
            ({usuario.rol || 'Sin rol'})
          </div>
        </div>
      </div>
      
      <nav style={{ display: 'grid', gap: 6 }}>
        <a href="#/dashboard" style={link}>📊 Dashboard</a>
        <a href="#/medicamentos" style={link}>💊 Medicamentos</a>
        <a href="#/ventas" style={link}>💰 Ventas</a>
        
        {/* Solo mostrar Compras si es admin */}
        {usuario && (usuario.rol === 'admin' || usuario.rol === 'administrador') && (
          <a href="#/compras" style={link}>🛒 Compras</a>
        )}
        
        <a href="#/lotes" style={link}>📦 Lotes</a>
        
        <button
          onClick={handleLogout}
          style={{ 
            ...link,
            marginTop: 20,
            backgroundColor: '#dc3545',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ 
          flex: 1, 
          padding: isLogged() ? 20 : 0, // Sin padding en login
          backgroundColor: isLogged() ? '#f5f5f5' : '#ffffff',
          minHeight: '100vh'
        }}>
          <Routes>
            {/* Redirección inicial */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/medicamentos" element={<RequireAuth><Medicamentos /></RequireAuth>} />
            <Route path="/compras" element={<RequireAuth><Compras /></RequireAuth>} />
            <Route path="/ventas" element={<RequireAuth><NuevaVenta /></RequireAuth>} />
            <Route path="/lotes" element={<RequireAuth><LotesDisponibles /></RequireAuth>} />
            <Route path="/invoice" element={<RequireAuth><Invoice /></RequireAuth>} />

            {/* 404 - Cualquier ruta no encontrada */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}