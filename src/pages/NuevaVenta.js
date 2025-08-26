// NuevaVenta.js - Prototipo Nueva Venta (PDF página 12).
// Cumple RF5 (registro ventas con detalles, cantidad, precio). Historia de usuario: Generar factura.
// Diagrama casos de uso: Nueva venta con búsqueda.
// Incluye depuración para identificar fallos en renderizado o eventos.

import React, { useState } from 'react';

function NuevaVenta() {
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [total, setTotal] = useState(0);

  console.log('Componente NuevaVenta renderizado'); // Depuración

  const handleBuscar = () => {
    console.log('Buscando:', busqueda); // Depuración
    // Simulada (futuro: API para búsqueda por nombre/código).
  };

  const handleCalcularTotal = () => {
    console.log('Calculando total para cantidad:', cantidad); // Depuración
    setTotal(cantidad * 10); // Precio simulado (futuro: cálculo real).
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '20px' }}>
      <h1>Nueva Venta</h1>
      <div>
        <input
          type="text"
          placeholder="Buscar medicamento por nombre o código"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value) || 0)} // Asegura número válido
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleCalcularTotal}>Calcular Total</button>
      </div>
      <p>Total: ${total.toFixed(2)}</p> {/* Formato decimal */}
      <button>Generar Factura</button>
    </div>
  );
}

export default NuevaVenta;