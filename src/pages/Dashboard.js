import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicamentos: 0,
    medicamentosBajoStock: 0,
    ventasHoy: 0,
    ventasTotales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  async function cargarEstadisticas() {
    try {
      setLoading(true);
      setError('');

      const medicamentos = await api.meds();
      
      const totalMedicamentos = medicamentos.length;
      const medicamentosBajoStock = medicamentos.filter(med => 
        med.stock <= (med.stock_minimo || 5)
      ).length;

      setStats({
        totalMedicamentos,
        medicamentosBajoStock,
        ventasHoy: 12,
        ventasTotales: 340
      });

    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="alert alert-error">{error}</div>
        <button onClick={cargarEstadisticas} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Bienvenido, {usuario.nombre || 'Usuario'}
        </h1>
        <p className="dashboard-subtitle">
          Panel de control - Sistema SOFARLIB
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-primary">
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.totalMedicamentos}</h3>
            <p className="stat-label">Medicamentos Total</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.medicamentosBajoStock}</h3>
            <p className="stat-label">Bajo Stock</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.ventasHoy}</h3>
            <p className="stat-label">Ventas Hoy</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.ventasTotales}</h3>
            <p className="stat-label">Ventas Totales</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="action-card">
          <h3 className="action-title">Alertas del Sistema</h3>
          <div className="alerts-list">
            {stats.medicamentosBajoStock > 0 ? (
              <div className="alert-item alert-warning">
                <span className="alert-icon">⚠️</span>
                <span>{stats.medicamentosBajoStock} medicamentos con stock bajo</span>
              </div>
            ) : (
              <div className="alert-item alert-success">
                <span className="alert-icon">✅</span>
                <span>Todos los medicamentos tienen stock suficiente</span>
              </div>
            )}
            
            <div className="alert-item alert-info">
              <span className="alert-icon">ℹ️</span>
              <span>Sistema funcionando correctamente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;