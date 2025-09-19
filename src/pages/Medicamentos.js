import React, { useState, useEffect } from 'react';
import api from '../api';

function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
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
      setMedicamentos(data);
    } catch (err) {
      console.error('Error cargando medicamentos:', err);
      setError('Error al cargar medicamentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function buscar() {
    try {
      const data = await api.meds(q);
      setMedicamentos(data);
    } catch (e) { alert(e.message); }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando medicamentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>{error}</p>
        <button onClick={cargarMedicamentos}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventario de Medicamentos</h2>
      <div style={{marginBottom: 12}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nombre o código" />
        <button onClick={buscar}>Buscar</button>
      </div>
      
      {medicamentos.length === 0 ? (
        <p>No hay medicamentos disponibles</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Código</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Stock</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Laboratorio</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.map(med => (
              <tr key={med.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px', fontFamily: 'monospace' }}>
                  {med.codigo}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {med.nombre}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <span style={{ 
                    color: med.stock > med.stock_minimo ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {med.stock}
                  </span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {med.laboratorio}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <span style={{ 
                    color: med.activo ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {med.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Medicamentos;
