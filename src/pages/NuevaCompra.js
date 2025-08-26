// NuevaCompra.js - Prototipo Nueva Compra (PDF página 13).
// Cumple RF1 (registro entradas), RF2 (fechas caducidad). Diagrama casos de uso: Nueva compra con múltiples medicamentos.

import React, { useState } from 'react';

function NuevaCompra() {
  const [proveedor, setProveedor] = useState('');
  const [medicamentos, setMedicamentos] = useState([{ nombre: '', cantidad: 0, precio: 0, vencimiento: '', lote: '' }]);
  const [total, setTotal] = useState(0);

  const agregarMedicamento = () => {
    setMedicamentos([...medicamentos, { nombre: '', cantidad: 0, precio: 0, vencimiento: '', lote: '' }]);
  };

  const handleChange = (index, field, value) => {
    const newMeds = [...medicamentos];
    newMeds[index][field] = value;
    setMedicamentos(newMeds);
    setTotal(newMeds.reduce((sum, med) => sum + (med.cantidad * med.precio), 0));
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Nueva Compra</h1>
      <select value={proveedor} onChange={(e) => setProveedor(e.target.value)}>
        <option>Selecciona Proveedor</option>
        <option>Proveedor 1</option>
      </select>
      {medicamentos.map((med, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input placeholder="Nombre Medicamento" value={med.nombre} onChange={(e) => handleChange(index, 'nombre', e.target.value)} />
          <input type="number" placeholder="Cantidad" value={med.cantidad} onChange={(e) => handleChange(index, 'cantidad', e.target.value)} />
          <input type="number" placeholder="Precio" value={med.precio} onChange={(e) => handleChange(index, 'precio', e.target.value)} />
          <input type="date" placeholder="Vencimiento" value={med.vencimiento} onChange={(e) => handleChange(index, 'vencimiento', e.target.value)} />
          <input placeholder="Lote" value={med.lote} onChange={(e) => handleChange(index, 'lote', e.target.value)} />
        </div>
      ))}
      <button onClick={agregarMedicamento}>+ Agregar Medicamento</button>
      <p>Total: ${total}</p>
      <button>Guardar Compra</button>
    </div>
  );
}

export default NuevaCompra;