import React, { useState, useEffect } from 'react';
import api from '../api';

function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamentosOriginales, setMedicamentosOriginales] = useState([]); // Datos originales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [q, setQ] = useState("");

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  async function cargarMedicamentos() {
    try {
      setLoading(true);
      setError('');
      
      const data = await api.meds();
      console.log('Medicamentos cargados:', data); // Para debug
      
      setMedicamentos(data);
      setMedicamentosOriginales(data); // Guardar copia original
    } catch (err) {
      console.error('Error cargando medicamentos:', err);
      setError('Error al cargar medicamentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda local (más rápida)
  function buscarLocal() {
    if (!q.trim()) {
      setMedicamentos(medicamentosOriginales);
      return;
    }

    const termino = q.toLowerCase().trim();
    const resultados = medicamentosOriginales.filter(med => 
      (med.nombre && med.nombre.toLowerCase().includes(termino)) ||
      (med.codigo && med.codigo.toLowerCase().includes(termino)) ||
      (med.laboratorio && med.laboratorio.toLowerCase().includes(termino))
    );

    console.log('Búsqueda local:', termino, 'Resultados:', resultados.length); // Para debug
    setMedicamentos(resultados);
  }

  // Búsqueda en servidor (alternativa)
  async function buscarServidor() {
    try {
      setError('');
      setLoading(true);
      
      const data = await api.meds(q);
      console.log('Búsqueda servidor:', q, 'Resultados:', data.length); // Para debug
      
      setMedicamentos(data);
    } catch (e) { 
      console.error('Error en búsqueda servidor:', e);
      setError('Error en búsqueda: ' + e.message);
      // Fallback a búsqueda local
      buscarLocal();
    } finally {
      setLoading(false);
    }
  }

  // Función principal de búsqueda
  function buscar() {
    // Primero intentar búsqueda local (más rápida)
    buscarLocal();
    
    // Opcionalmente también buscar en servidor
    // buscarServidor();
  }

  // Búsqueda en tiempo real mientras escribes
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarLocal();
    }, 300); // Esperar 300ms después de dejar de escribir

    return () => clearTimeout(timer);
  }, [q, medicamentosOriginales]);

  // Función para buscar al presionar Enter
  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscar();
    }
  }

  // Función para limpiar búsqueda
  function limpiarBusqueda() {
    setQ('');
    setMedicamentos(medicamentosOriginales);
  }

  if (loading && medicamentos.length === 0) {
    return <div className="loading">Cargando medicamentos...</div>;
  }

  if (error && medicamentos.length === 0) {
    return (
      <div className="error-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={cargarMedicamentos} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="medicamentos-container">
      <h2 className="card-title">Inventario de Medicamentos</h2>
      
      <div className="search-bar">
        <input 
          className="search-input"
          type="text"
          value={q} 
          onChange={e => setQ(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Buscar por nombre, código o laboratorio..." 
        />
        <button onClick={buscar} className="btn btn-primary">
          🔍 Buscar
        </button>
        {q && (
          <button onClick={limpiarBusqueda} className="btn btn-secondary">
            🗑️ Limpiar
          </button>
        )}
        <button onClick={cargarMedicamentos} className="btn btn-secondary">
          🔄 Recargar
        </button>
      </div>
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}
      
      {medicamentos.length === 0 ? (
        <div className="text-center">
          <p>No hay medicamentos disponibles</p>
          {q && <p className="text-muted">No se encontraron resultados para: "<strong>{q}</strong>"</p>}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th className="text-center">Stock</th>
                <th>Laboratorio</th>
                <th className="text-center">Precio</th>
                <th className="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map(med => (
                <tr key={med.id || Math.random()}>
                  <td className="text-monospace">{med.codigo || 'N/A'}</td>
                  <td>{med.nombre || 'Sin nombre'}</td>
                  <td className="text-center">
                    <span className={med.stock > (med.stock_minimo || 5) ? 'text-success' : 'text-danger'}>
                      {med.stock || 0}
                    </span>
                  </td>
                  <td>{med.laboratorio || 'N/A'}</td>
                  <td className="text-center">
                    <span className="text-success">
                      {med.precio ? `$${parseFloat(med.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}` : '$0.00'}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={med.activo ? 'text-success' : 'text-danger'}>
                      {med.activo ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="medicamentos-info">
        <p className="text-muted">
          Total mostrado: {medicamentos.length} de {medicamentosOriginales.length} medicamentos
        </p>
        {q && (
          <p className="text-muted">
            Filtro activo: "<strong>{q}</strong>"
          </p>
        )}
        {loading && <p className="text-muted">🔄 Buscando...</p>}
      </div>
    </div>
  );
}

export default Medicamentos;
