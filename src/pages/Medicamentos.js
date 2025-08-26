// Medicamentos.js - Prototipo Gestión de Medicamentos (PDF página 11).
// Cumple RF1 (gestión inventario), RF3 (búsqueda). Diagrama clases: Medicamento con atributos (nombre, código, stock).
// Estándares: Tabla accesible con acciones.

import React from 'react';

function Medicamentos() {
  // Datos simulados (futuro: API para listado real).
  const meds = [
    { nombre: 'Aspirina', codigo: '001', stock: 100, vencimiento: '2026-01-01', lote: 'L123', lab: 'Bayer', gramos: '500mg' },
    { nombre: 'Paracetamol', codigo: '002', stock: 50, vencimiento: '2025-12-15', lote: 'L456', lab: 'Pfizer', gramos: '1g' },
  ];

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Gestión de Medicamentos</h1>
      <button>Nuevo Medicamento</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Stock Actual</th>
            <th>Vencimiento</th>
            <th>Lote</th>
            <th>Laboratorio</th>
            <th>Gramos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {meds.map((med, index) => (
            <tr key={index}>
              <td>{med.nombre}</td>
              <td>{med.codigo}</td>
              <td>{med.stock}</td>
              <td>{med.vencimiento}</td>
              <td>{med.lote}</td>
              <td>{med.lab}</td>
              <td>{med.gramos}</td>
              <td>
                <button>Ver Detalles</button>
                <button>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Medicamentos;