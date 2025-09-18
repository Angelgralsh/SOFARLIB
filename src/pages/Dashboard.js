// Dashboard.js - Prototipo Panel Principal 


import React from 'react';

function Dashboard() {
  // Datos simulados 
  const totalMedicamentos = 150;
  const alertasStock = 5;
  const alertasVencimiento = 3;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Panel Principal - SOFARLIB</h1>
      <section>
        <h2>Resumen General</h2>
        <p>Total de Medicamentos: {totalMedicamentos}</p>
        <p>Medicamentos con Alerta de Stock: {alertasStock}</p>
        <p>Medicamentos Próximos a Vencer: {alertasVencimiento}</p>
      </section>
      <section>
        <h2>Alertas</h2>
        <ul>
          <li>Stock Mínimo: Medicamento X (Stock: 2)</li>
          <li>Próximos a Vencer: Medicamento Y (Fecha: 2025-09-01)</li>
        </ul>
      </section>
      <section>
        <h2>Acciones Rápidas</h2>
        <button>Registrar Compra</button>
        <button>Registrar Venta</button>
        <button>Ajuste de Inventario</button>
        <button>Reporte Rápido de Stock</button>
      </section>
    </div>
  );
}

export default Dashboard;