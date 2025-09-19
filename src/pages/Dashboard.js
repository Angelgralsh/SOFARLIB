import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({
    total_medicamentos: 0,
    total_ventas: 0,
    total_compras: 0,
    ventas_hoy: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    console.log('Verificando datos en Dashboard...');
    console.log('userData:', userData);
    console.log('isLoggedIn:', isLoggedIn);
    
    if (!isLoggedIn || !userData) {
      console.log('No hay datos de sesión, redirigiendo al login');
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log('Usuario parseado:', parsedUser);
      setUsuario(parsedUser);
      
      // Cargar estadísticas básicas
      loadStats();
    } catch (err) {
      console.error('Error parseando usuario:', err);
      navigate('/login');
    }
  }, [navigate]);

  const loadStats = async () => {
    try {
      // Por ahora, estadísticas estáticas
      setStats({
        total_medicamentos: 15,
        total_ventas: 10,
        total_compras: 5,
        ventas_hoy: 3
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  if (!usuario) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Dashboard - SOFARLIB</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Bienvenido, <strong>{usuario.nombre}</strong> ({usuario.rol || 'Sin rol'})
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #007bff'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>💊 Medicamentos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {stats.total_medicamentos}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Total en inventario
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #28a745'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>💰 Ventas Totales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {stats.total_ventas}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Ventas registradas
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #17a2b8'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>📅 Ventas Hoy</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {stats.ventas_hoy}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Ventas de hoy
          </p>
        </div>

        {(usuario.rol === 'admin' || usuario.rol === 'administrador') && (
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #ffc107'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>🛒 Compras</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {stats.total_compras}
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              Compras registradas
            </p>
          </div>
        )}
      </div>

      {/* Acciones Rápidas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        <div 
          onClick={() => navigate('/ventas')}
          style={{
            padding: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>💊 Nueva Venta</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Registrar ventas de medicamentos</p>
        </div>

        <div 
          onClick={() => navigate('/medicamentos')}
          style={{
            padding: '20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>📦 Inventario</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Consultar stock de medicamentos</p>
        </div>

        {(usuario.rol === 'admin' || usuario.rol === 'administrador') && (
          <div 
            onClick={() => navigate('/compras')}
            style={{
              padding: '20px',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>🛒 Compras</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Gestionar compras (Solo Admin)</p>
          </div>
        )}

        <div 
          onClick={() => navigate('/lotes')}
          style={{
            padding: '20px',
            backgroundColor: '#6f42c1',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>📋 Lotes</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Ver lotes disponibles</p>
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🔍 Información de Debug:</h4>
        <p style={{ margin: '5px 0' }}><strong>Usuario ID:</strong> {usuario.id}</p>
        <p style={{ margin: '5px 0' }}><strong>Nombre:</strong> {usuario.nombre}</p>
        <p style={{ margin: '5px 0' }}><strong>Email:</strong> {usuario.email}</p>
        <p style={{ margin: '5px 0' }}><strong>Rol:</strong> {usuario.rol || 'Sin rol asignado'}</p>
      </div>
    </div>
  );
}

export default Dashboard;
