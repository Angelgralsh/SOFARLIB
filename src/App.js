// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicamentos from './pages/Medicamentos';
import NuevaVenta from './pages/NuevaVenta';
import NuevaCompra from './pages/NuevaCompra';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/medicamentos" element={
          <ProtectedRoute>
            <Layout><Medicamentos /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nueva-venta" element={
          <ProtectedRoute>
            <Layout><NuevaVenta /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nueva-compra" element={
          <ProtectedRoute>
            <Layout><NuevaCompra /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;