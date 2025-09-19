import React, { useState, useEffect } from 'react';
import api from '../api';

function NuevaVenta() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cliente, setCliente] = useState('');
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  useEffect(() => {
    calcularTotal();
  }, [carrito]);

  async function cargarMedicamentos() {
    try {
      setLoading(true);
      const data = await api.meds();
      console.log('Medicamentos cargados:', data);
      setMedicamentos(data || []);
    } catch (e) {
      console.error('Error cargando medicamentos:', e);
      alert('Error al cargar medicamentos');
      setMedicamentos([]);
    } finally {
      setLoading(false);
    }
  }

  function calcularTotal() {
    const suma = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setTotal(suma);
  }

  function agregarAlCarrito() {
    if (!medicamentoSeleccionado || cantidad <= 0) {
      alert('Seleccione un medicamento y cantidad válida');
      return;
    }

    const medicamento = medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado));
    if (!medicamento) {
      alert('Medicamento no encontrado');
      return;
    }

    // Agregar precio manual si no existe
    const precio = parseFloat(document.getElementById('precio-manual')?.value || 0);
    if (precio <= 0) {
      alert('Por favor ingrese un precio válido');
      return;
    }

    const itemExistente = carrito.find(item => item.id === medicamento.id);
    
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + parseInt(cantidad);
      if (nuevaCantidad > medicamento.stock) {
        alert(`No se puede agregar. Stock máximo: ${medicamento.stock}`);
        return;
      }
      
      setCarrito(carrito.map(item => 
        item.id === medicamento.id 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        id: medicamento.id,
        codigo: medicamento.codigo,
        nombre: medicamento.nombre,
        precio: precio, // Usar precio manual
        cantidad: parseInt(cantidad),
        stock: medicamento.stock
      }]);
    }

    setMedicamentoSeleccionado('');
    setCantidad(1);
    setBusqueda('');
  }

  function eliminarDelCarrito(id) {
    setCarrito(carrito.filter(item => item.id !== id));
  }

  function actualizarCantidad(id, nuevaCantidad) {
    const cantidadNum = parseInt(nuevaCantidad);
    
    if (cantidadNum <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    const item = carrito.find(i => i.id === id);
    if (item && cantidadNum > item.stock) {
      alert(`Stock máximo: ${item.stock}`);
      return;
    }

    setCarrito(carrito.map(item => 
      item.id === id ? { ...item, cantidad: cantidadNum } : item
    ));
  }

  async function procesarVenta() {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!cliente.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        cliente: cliente.trim(),
        items: carrito.map(item => ({
          medicamento_id: item.id,
          cantidad: item.cantidad,
          precio_unit: item.precio
        }))
      };
      
      console.log('Enviando venta:', payload);
      const r = await api.venta(payload);
      setResp(r);
      alert('¡Venta registrada exitosamente!');
      setCarrito([]);
      setCliente('');
      setBusqueda('');
      cargarMedicamentos(); // Recargar para actualizar stock
    } catch (e) {
      console.error('Error al procesar venta:', e);
      alert('Error al procesar venta: ' + (e.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }

  function limpiarCarrito() {
    setCarrito([]);
    setCliente('');
    setBusqueda('');
    setMedicamentoSeleccionado('');
  }

  const medicamentosFiltrados = medicamentos.filter(m => 
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.codigo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const medicamentoActual = medicamentoSeleccionado ? 
    medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado)) : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #007bff, #0056b3)', 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center', 
        borderRadius: '8px 8px 0 0',
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        💊 SOFARLIB - Sistema de Ventas
      </div>

      {/* Sección de Selección de Medicamentos */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        border: '1px solid #dee2e6',
        borderTop: 'none'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#495057', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>🏥</span>
          Registro de Venta
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Buscar por Código/Nombre:
            </label>
            <input 
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: ACET-500-01 o Acetaminofén"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Nombre del Cliente:
            </label>
            <input 
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ingrese el nombre del cliente"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Seleccionar Medicamento:
            </label>
            <select 
              value={medicamentoSeleccionado}
              onChange={(e) => setMedicamentoSeleccionado(e.target.value)}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: loading ? '#f8f9fa' : 'white'
              }}
            >
              <option value="">-- Seleccione un medicamento --</option>
              {medicamentosFiltrados.map(med => (
                <option key={med.id} value={med.id} disabled={med.stock <= 0}>
                  {med.codigo} - {med.nombre} - Stock: {med.stock} - ${parseFloat(med.precio || 0).toFixed(2)}
                </option>
              ))}
            </select>
            {loading && <small style={{ color: '#6c757d' }}>Cargando medicamentos...</small>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Cantidad:
            </label>
            <input 
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              max={medicamentoActual?.stock || 1}
              disabled={!medicamentoSeleccionado}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Precio Unitario:
            </label>
            <input 
              id="precio-manual"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Stock Disponible:
            </label>
            <input 
              type="text"
              readOnly
              value={medicamentoActual ? medicamentoActual.stock : '0'}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px', 
                background: '#e9ecef',
                fontSize: '14px',
                fontWeight: 'bold',
                color: medicamentoActual?.stock > 0 ? '#28a745' : '#dc3545'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Subtotal:
            </label>
            <input 
              type="text"
              readOnly
              value={medicamentoActual ? `$${(parseFloat(medicamentoActual.precio || 0) * cantidad).toFixed(2)}` : '$0.00'}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ced4da', 
                borderRadius: '4px', 
                background: '#e9ecef',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            />
          </div>
          <button 
            onClick={agregarAlCarrito}
            disabled={!medicamentoSeleccionado || cantidad <= 0 || loading}
            style={{
              background: medicamentoSeleccionado && cantidad > 0 ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: medicamentoSeleccionado && cantidad > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            ➕ AGREGAR
          </button>
        </div>
      </div>

      {/* Tabla de Medicamentos en el Carrito */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          background: '#28a745', 
          color: 'white',
          margin: 0, 
          padding: '15px', 
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🛒 Carrito de Venta ({carrito.length} productos)</span>
          {carrito.length > 0 && (
            <button 
              onClick={limpiarCarrito}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
        
        {carrito.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6c757d',
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderTop: 'none'
          }}>
            <p style={{ fontSize: '16px', margin: 0 }}>
              El carrito está vacío. Agregue medicamentos para continuar.
            </p>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6', borderTop: 'none' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left', fontWeight: 'bold' }}>Código</th>
                  <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left', fontWeight: 'bold' }}>Medicamento</th>
                  <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>Precio Unit.</th>
                  <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>Cantidad</th>
                  <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>Subtotal</th>
                  <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', fontFamily: 'monospace' }}>
                      {item.codigo}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', fontWeight: '500' }}>
                      {item.nombre}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>
                      ${item.precio.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.id, e.target.value)}
                        min="1"
                        max={item.stock}
                        style={{ 
                          width: '70px', 
                          textAlign: 'center', 
                          border: '1px solid #ced4da', 
                          borderRadius: '3px',
                          padding: '5px'
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', color: '#28a745' }}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      <button 
                        onClick={() => eliminarDelCarrito(item.id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total y botones */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px',
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderTop: 'none'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                💰 Total: ${total.toFixed(2)}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={limpiarCarrito}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  🗑️ LIMPIAR
                </button>
                <button 
                  onClick={procesarVenta}
                  disabled={loading || carrito.length === 0}
                  style={{
                    background: loading || carrito.length === 0 ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '4px',
                    cursor: loading || carrito.length === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? '⏳ PROCESANDO...' : '💳 REALIZAR VENTA'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        background: 'linear-gradient(135deg, #6c757d, #495057)', 
        color: 'white', 
        padding: '15px', 
        textAlign: 'center', 
        borderRadius: '0 0 8px 8px',
        marginTop: '20px',
        fontSize: '14px'
      }}>
        © SOFARLIB - Sistema de Gestión Farmacéutica 2025
      </div>

      {/* Debug Info */}
      {resp && (
        <div style={{ 
          marginTop: '20px', 
          background: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          padding: '15px'
        }}>
          <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>✅ Venta Procesada:</h4>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '3px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(resp, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default NuevaVenta;