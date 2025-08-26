// Sidebar.js - Componente reutilizable para el menú lateral (PDF mockups, páginas 9-14).
// Basado en mapa de navegación (páginas 3-5), cumple usabilidad (navegación intuitiva) y accesibilidad (contrastes WCAG).
// Usa paleta moderna: azul profundo (#1A3C5A) para menú, gris azulado (#E6ECEF) como fondo.

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/global.css'; // Asegura acceso a variables CSS

function Sidebar() {
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/medicamentos', name: 'Medicamentos' },
    { path: '/nueva-compra', name: 'Nueva Compra' },
    { path: '/nueva-venta', name: 'Nueva Venta' },
    { path: '/reportes', name: 'Reportes' },
    { path: '/', name: 'Cerrar Sesión' }, // Simulado, redirige a Login
  ];

  return (
    <div style={{
      width: '250px',
      backgroundColor: 'var(--azul-profundo)',
      color: 'var(--blanco)',
      height: '100vh',
      position: 'fixed',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <h3 style={{ marginTop: 0, paddingBottom: '15px', borderBottom: '1px solid var(--gris-suave)' }}>SOFARLIB</h3>
      <nav>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px',
              textDecoration: 'none',
              color: isActive ? 'var(--azul-cian)' : 'var(--blanco)',
              fontWeight: isActive ? 'bold' : 'normal',
            })}
            onClick={(e) => item.name === 'Cerrar Sesión' && (e.preventDefault(), alert('Sesión cerrada'), window.location.href = '/')}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;