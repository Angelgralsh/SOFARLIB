// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  function handleLogout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">SOFARLIB</h3>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{usuario.nombre || 'Usuario'}</p>
          <small className="sidebar-user-email">{usuario.email}</small>
          <br />
          <small className="sidebar-user-role">
            ({usuario.rol || 'regente'})
          </small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link">
          <span className="sidebar-icon">📊</span>
          Dashboard
        </Link>

        <Link to="/medicamentos" className="sidebar-link">
          <span className="sidebar-icon">💊</span>
          Medicamentos
        </Link>

        <Link to="/nueva-venta" className="sidebar-link">
          <span className="sidebar-icon">🛒</span>
          Ventas
        </Link>

        <Link to="/nueva-compra" className="sidebar-link">
          <span className="sidebar-icon">📦</span>
          Nueva Compra
        </Link>
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        🚪 Cerrar Sesión
      </button>
    </div>
  );
}

export default Sidebar;

