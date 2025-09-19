


import React, { useState } from 'react';

function Reportes() {
  const [filtro, setFiltro] = useState('');
  const stocks = [
    { nombre: 'Aspirina', codigo: '001', stock: 100 },
    { nombre: 'Paracetamol', codigo: '002', stock: 50 },
  ];

  const filteredStocks = stocks.filter(med => med.nombre.includes(filtro));

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Reportes - Stock Actual</h1>
      <input placeholder="Filtrar por categoría/nombre" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Stock Actual</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((med, index) => (
            <tr key={index}>
              <td>{med.nombre}</td>
              <td>{med.codigo}</td>
              <td>{med.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Exportar (CSV/Excel/PDF)</button> // Simulado (futuro: librería para export).
    </div>
  );
}

export default Reportes;