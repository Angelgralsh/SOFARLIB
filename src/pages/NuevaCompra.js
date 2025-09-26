import React, { useState, useEffect } from 'react';
import api from '../services/api';

function NuevaCompra() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [proveedor, setProveedor] = useState('');
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  useEffect(() => {
    calcularTotal();
  }, [carrito]);

  // Actualizar precios cuando cambia la selección
  useEffect(() => {
    if (medicamentoSeleccionado) {
      const medicamento = medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado));
      if (medicamento) {
        setPrecioCompra(parseFloat(medicamento.precio * 0.6) || 0); // 60% del precio de venta
        setPrecioVenta(parseFloat(medicamento.precio || 0));
      }
    } else {
      setPrecioCompra(0);
      setPrecioVenta(0);
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
    const suma = carrito.reduce((acc, item) => acc + (item.precio_compra * item.cantidad), 0);
    setTotal(suma);
  }

  function agregarAlCarrito() {
    if (!medicamentoSeleccionado || cantidad <= 0) {
      alert('Seleccione un medicamento y cantidad válida');
      return;
    }

    if (precioCompra <= 0) {
      alert('Por favor ingrese un precio de compra válido');
      return;
    }

    if (precioVenta <= 0) {
      alert('Por favor ingrese un precio de venta válido');
      return;
    }

    const medicamento = medicamentos.find(m => m.id === parseInt(medicamentoSeleccionado));
    if (!medicamento) {
      alert('Medicamento no encontrado');
      return;
    }

    const itemExistente = carrito.find(item => item.id === medicamento.id);
    
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + parseInt(cantidad);
      
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
        precio_compra: precioCompra,
        precio_venta: precioVenta,
        cantidad: parseInt(cantidad),
        stock_actual: medicamento.stock
      }]);
    }

    // Limpiar formulario
    setMedicamentoSeleccionado('');
    setCantidad(1);
    setBusqueda('');
    setPrecioCompra(0);
    setPrecioVenta(0);
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

    setCarrito(carrito.map(item => 
      item.id === id ? { ...item, cantidad: cantidadNum } : item
    ));
  }

  async function procesarCompra() {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!proveedor.trim()) {
      alert('Por favor ingrese el nombre del proveedor');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        proveedor: proveedor.trim(),
        items: carrito.map(item => ({
          medicamento_id: item.id,
          cantidad: item.cantidad,
          precio_compra: item.precio_compra,
          precio_venta: item.precio_venta
        }))
      };
      
      console.log('Enviando compra:', payload);
      const r = await api.createCompra(payload);
      setResp(r);
      
      // ✅ ACTUALIZAR STOCK LOCALMENTE (SUMAR al inventario)
      const medicamentosActualizados = medicamentos.map(med => {
        const itemComprado = carrito.find(item => item.id === med.id);
        if (itemComprado) {
          return {
            ...med,
            stock: med.stock + itemComprado.cantidad,
            precio: itemComprado.precio_venta // Actualizar precio de venta
          };
        }
        return med;
      });
      
      setMedicamentos(medicamentosActualizados);
      
      // ✅ LIMPIAR FORMULARIO
      alert('¡Compra registrada exitosamente! Stock actualizado.');
      setCarrito([]);
      setProveedor('');
      setBusqueda('');
      setMedicamentoSeleccionado('');
      setPrecioCompra(0);
      setPrecioVenta(0);
      
    } catch (e) {
      console.error('Error al procesar compra:', e);
      alert('Error al procesar compra: ' + (e.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }

  function limpiarCarrito() {
    setCarrito([]);
    setProveedor('');
    setBusqueda('');
    setMedicamentoSeleccionado('');
    setPrecioCompra(0);
    setPrecioVenta(0);
  }

  // Filtrado de medicamentos
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
        📦 SOFARLIB - Sistema de Compras y Abastecimiento
      </div>

      <div className="venta-form-section">
        <h3 className="venta-section-title">
          <span style={{ marginRight: '10px' }}>🏭</span>
          Registro de Compra
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
            <label className="form-label">Nombre del Proveedor:</label>
            <input 
              type="text"
              className="form-input"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              placeholder="Ej: Laboratorios Genfar S.A."
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
                <option key={med.id} value={med.id}>
                  {med.codigo} - {med.nombre} - Stock: {med.stock}
                </option>
              ))}
            </select>
            {loading && <small className="text-muted">Cargando medicamentos...</small>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Cantidad a Comprar:</label>
            <input 
              type="number"
              className="form-input"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              disabled={!medicamentoSeleccionado}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Precio de Compra:</label>
            <input 
              type="number"
              className="form-input"
              step="0.01"
              min="0"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Stock Actual:</label>
            <input 
              type="text"
              className="form-input venta-input-readonly venta-input-stock"
              readOnly
              value={medicamentoActual ? medicamentoActual.stock : '0'}
            />
          </div>
        </div>

        <div className="venta-grid-2">
          <div className="form-group">
            <label className="form-label">Precio de Venta:</label>
            <input 
              type="number"
              className="form-input"
              step="0.01"
              min="0"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subtotal:</label>
            <input 
              type="text"
              className="form-input venta-input-readonly"
              readOnly
              value={`$${(precioCompra * cantidad).toFixed(2)}`}
            />
          </div>
        </div>

        <div className="venta-grid-2">
          <div className="form-group">
            <label className="form-label">Nuevo Stock:</label>
            <input 
              type="text"
              className="form-input venta-input-readonly"
              style={{ color: 'green', fontWeight: 'bold' }}
              readOnly
              value={medicamentoActual ? `${medicamentoActual.stock} + ${cantidad} = ${medicamentoActual.stock + parseInt(cantidad || 0)}` : '0'}
            />
          </div>
          <div className="form-group" style={{ alignSelf: 'end' }}>
            <button 
              className="btn-add-cart"
              style={{ background: '#17a2b8' }}
              onClick={agregarAlCarrito}
              disabled={!medicamentoSeleccionado || cantidad <= 0 || precioCompra <= 0 || precioVenta <= 0 || loading}
            >
              ➕ AGREGAR AL PEDIDO
            </button>
          </div>
        </div>
      </div>

      {/* Carrito de Compras */}
      <div style={{ marginTop: '20px' }}>
        <div className="carrito-header" style={{ background: '#17a2b8' }}>
          <span>📦 Pedido de Compra ({carrito.length} productos)</span>
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
            <p>El pedido está vacío. Agregue medicamentos para continuar.</p>
          </div>
        ) : (
          <>
            <table className="carrito-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Medicamento</th>
                  <th style={{ textAlign: 'center' }}>P. Compra</th>
                  <th style={{ textAlign: 'center' }}>P. Venta</th>
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
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#dc3545' }}>
                      ${item.precio_compra.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#28a745' }}>
                      ${item.precio_venta.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.id, e.target.value)}
                        min="1"
                        style={{ 
                          width: '70px', 
                          textAlign: 'center', 
                          border: '1px solid #ced4da', 
                          borderRadius: '3px',
                          padding: '5px'
                        }}
                      />
                    </td>
                    <td className="text-center" style={{ fontWeight: 'bold', color: '#17a2b8' }}>
                      ${(item.precio_compra * item.cantidad).toFixed(2)}
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
              <div className="total-amount" style={{ color: '#17a2b8' }}>
                💰 Total a Pagar: ${total.toFixed(2)}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={limpiarCarrito}
                  className="btn btn-secondary"
                >
                  🗑️ LIMPIAR
                </button>
                <button 
                  onClick={procesarCompra}
                  disabled={loading || carrito.length === 0}
                  className="btn btn-primary"
                  style={{ fontSize: '16px', padding: '12px 30px', background: '#17a2b8', borderColor: '#17a2b8' }}
                >
                  {loading ? '⏳ PROCESANDO...' : '📦 REGISTRAR COMPRA'}
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
          <h4 className="debug-title">✅ Compra Procesada:</h4>
          <pre className="debug-content">
            {JSON.stringify(resp, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default NuevaCompra;