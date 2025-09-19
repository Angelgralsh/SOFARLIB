// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const link = ({ isActive }) => ({
  padding: '10px 12px',
  borderRadius: 8,
  textDecoration: 'none',
  display: 'block',
  color: isActive ? '#0b2b4a' : '#173a5e',
  background: isActive ? '#eaf3ff' : 'transparent',
});

export default function Sidebar() {
  return (
    <aside style={{ width: 220, padding: 16, borderRight: '1px solid #e5e5e5', height: '100vh', position: 'sticky', top: 0 }}>
      <h3 style={{ marginTop: 0 }}>Menú</h3>
      <nav style={{ display: 'grid', gap: 6 }}>
        <NavLink to="/dashboard" style={link}>Dashboard</NavLink>
        <NavLink to="/medicamentos" style={link}>Medicamentos</NavLink>
        <NavLink to="/compras" style={link}>Compras</NavLink>
        <NavLink to="/ventas" style={link}>Ventas</NavLink>
        <NavLink to="/lotes" style={link}>Lotes</NavLink>
      </nav>
    </aside>
  );
}
