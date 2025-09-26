import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
  const [precioUnitario, setPrecioUnitario] = useState(0);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  useEffect(() => {
    calcularTotal();
  }, [carrito]);

  // Actualizar precio y stock cuando cambia la selección
  useEffect(() => {
    if (medicamentoSeleccionado) {
      const medicamento = medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado));
      if (medicamento) {
        setPrecioUnitario(parseFloat(medicamento.precio || 0));
      }
    } else {
      setPrecioUnitario(0);
    }
  }, [medicamentoSeleccionado, medicamentos]);

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

    if (precioUnitario <= 0) {
      alert('Por favor ingrese un precio válido');
      return;
    }

    const medicamento = medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado));
    if (!medicamento) {
      alert('Medicamento no encontrado');
      return;
    }

    if (cantidad > medicamento.stock) {
      alert(`Stock insuficiente. Disponible: ${medicamento.stock}`);
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
        precio: precioUnitario,
        cantidad: parseInt(cantidad),
        stock: medicamento.stock
      }]);
    }

    // Limpiar formulario
    setMedicamentoSeleccionado('');
    setCantidad(1);
    setBusqueda('');
    setPrecioUnitario(0);
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
      const r = await api.createVenta(payload);
      setResp(r);
      
      // ✅ ACTUALIZAR STOCK LOCALMENTE (INMEDIATO)
      const medicamentosActualizados = medicamentos.map(med => {
        const itemVendido = carrito.find(item => item.id === med.id);
        if (itemVendido) {
          return {
            ...med,
            stock: med.stock - itemVendido.cantidad
          };
        }
        return med;
      });
      
      setMedicamentos(medicamentosActualizados);
      
      // ✅ LIMPIAR FORMULARIO
      alert('¡Venta registrada exitosamente!');
      setCarrito([]);
      setCliente('');
      setBusqueda('');
      setMedicamentoSeleccionado('');
      setPrecioUnitario(0);
      
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
    setPrecioUnitario(0);
  }

  // Filtrado mejorado que funciona en tiempo real
  const medicamentosFiltrados = medicamentos.filter(m => {
    if (!busqueda.trim()) return true;
    
    const termino = busqueda.toLowerCase();
    return (
      (m.nombre && m.nombre.toLowerCase().includes(termino)) ||
      (m.codigo && m.codigo.toLowerCase().includes(termino)) ||
      (m.laboratorio && m.laboratorio.toLowerCase().includes(termino))
    );
  });

  const medicamentoActual = medicamentoSeleccionado ? 
    medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado)) : null;

  return (
    <div className="nueva-venta-container">
      <div className="venta-header">
        💊 SOFARLIB - Sistema de Ventas
      </div>

      <div className="venta-form-section">
        <h3 className="venta-section-title">
          <span style={{ marginRight: '10px' }}>🏥</span>
          Registro de Venta
        </h3>
        
        <div className="venta-grid-2">
          <div className="form-group">
            <label className="form-label">Buscar por Código/Nombre:</label>
            <input 
              type="text"
              className="form-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: ACET-500-01 o Acetaminofén"
            />
            <small className="text-muted">
              {busqueda && `${medicamentosFiltrados.length} medicamentos encontrados`}
            </small>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre del Cliente:</label>
            <input 
              type="text"
              className="form-input"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ingrese el nombre del cliente"
            />
          </div>
        </div>

        <div className="venta-grid-4">
          <div className="form-group">
            <label className="form-label">Seleccionar Medicamento:</label>
            <select 
              className="venta-select"
              value={medicamentoSeleccionado}
              onChange={(e) => setMedicamentoSeleccionado(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Seleccione un medicamento --</option>
              {medicamentosFiltrados.map(med => (
                <option key={med.id} value={med.id} disabled={med.stock <= 0}>
                  {med.codigo} - {med.nombre} - Stock: {med.stock}
                </option>
              ))}
            </select>
            {loading && <small className="text-muted">Cargando medicamentos...</small>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Cantidad:</label>
            <input 
              type="number"
              className="form-input"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              max={medicamentoActual?.stock || 1}
              disabled={!medicamentoSeleccionado}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Precio Unitario:</label>
            <input 
              type="number"
              className="form-input"
              step="0.01"
              min="0"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Stock Disponible:</label>
            <input 
              type="text"
              className={`form-input venta-input-readonly ${medicamentoActual?.stock > 5 ? 'venta-input-stock' : 'venta-input-stock low-stock'}`}
              readOnly
              value={medicamentoActual ? medicamentoActual.stock : '0'}
            />
          </div>
        </div>

        <div className="venta-grid-2">
          <div className="form-group">
            <label className="form-label">Subtotal:</label>
            <input 
              type="text"
              className="form-input venta-input-readonly"
              readOnly
              value={`$${(precioUnitario * cantidad).toFixed(2)}`}
            />
          </div>
          <div className="form-group" style={{ alignSelf: 'end' }}>
            <button 
              className="btn-add-cart"
              onClick={agregarAlCarrito}
              disabled={!medicamentoSeleccionado || cantidad <= 0 || precioUnitario <= 0 || loading}
            >
              ➕ AGREGAR AL CARRITO
            </button>
          </div>
        </div>
      </div>

      {/* Carrito */}
      <div style={{ marginTop: '20px' }}>
        <div className="carrito-header">
          <span>🛒 Carrito de Venta ({carrito.length} productos)</span>
          {carrito.length > 0 && (
            <button 
              onClick={limpiarCarrito}
              className="btn btn-danger"
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
        
        {carrito.length === 0 ? (
          <div className="carrito-empty">
            <p>El carrito está vacío. Agregue medicamentos para continuar.</p>
          </div>
        ) : (
          <>
            <table className="carrito-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Medicamento</th>
                  <th style={{ textAlign: 'center' }}>Precio Unit.</th>
                  <th style={{ textAlign: 'center' }}>Cantidad</th>
                  <th style={{ textAlign: 'center' }}>Subtotal</th>
                  <th style={{ textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td className="text-monospace">{item.codigo}</td>
                    <td>{item.nombre}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      ${item.precio.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
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
                    <td className="text-center text-success" style={{ fontWeight: 'bold' }}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="carrito-total">
              <div className="total-amount">
                💰 Total: ${total.toFixed(2)}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={limpiarCarrito}
                  className="btn btn-secondary"
                >
                  🗑️ LIMPIAR
                </button>
                <button 
                  onClick={procesarVenta}
                  disabled={loading || carrito.length === 0}
                  className="btn btn-primary"
                  style={{ fontSize: '16px', padding: '12px 30px' }}
                >
                  {loading ? '⏳ PROCESANDO...' : '💳 REALIZAR VENTA'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="venta-footer">
        © SOFARLIB - Sistema de Gestión Farmacéutica 2025
      </div>

      {resp && (
        <div className="debug-info">
          <h4 className="debug-title">✅ Venta Procesada:</h4>
          <pre className="debug-content">
            {JSON.stringify(resp, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default NuevaVenta;