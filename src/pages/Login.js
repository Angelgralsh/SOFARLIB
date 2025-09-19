import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpiar localStorage al cargar la página de login
  useEffect(() => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('isLoggedIn');
    localStorage.clear(); // Limpia todo el localStorage
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setMsg('Por favor ingresa email y contraseña');
      return;
    }

    setLoading(true);
    setMsg('Validando...');
    
    try {
      console.log('Intentando login con:', { email, password });
      
      const data = await api.login(email, password);
      console.log('Respuesta del servidor:', data);
      
      if (data && data.user) {
        console.log('Usuario obtenido:', data.user);
        
        // Validar que el usuario tenga datos mínimos
        if (!data.user.id || !data.user.nombre || !data.user.email) {
          setMsg('Datos de usuario incompletos');
          setLoading(false);
          return;
        }
        
        // Si el rol está vacío, asignar uno por defecto
        if (!data.user.rol || data.user.rol.trim() === '') {
          console.log('Rol vacío, asignando rol por defecto');
          data.user.rol = data.user.email.includes('admin') ? 'admin' : 'regente';
        }
        
        setMsg('¡Login exitoso! Redirigiendo...');
        
        // Limpiar localStorage antes de guardar nuevos datos
        localStorage.clear();
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Datos guardados en localStorage:', localStorage.getItem('usuario'));
        console.log('Navegando al dashboard...');
        
        // Navegar al dashboard
        navigate('/dashboard', { replace: true });
        
      } else {
        console.log('Respuesta inesperada:', data);
        setMsg('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setMsg('Error de conexión o credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container" style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Inicio de Sesión - SOFARLIB
      </h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Ingresa tu email"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !email.trim() || !password.trim()}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Validando...' : 'Ingresar'}
        </button>
        
        <p style={{ 
          color: msg.includes('exitoso') ? 'green' : 'red', 
          textAlign: 'center',
          marginTop: '10px',
          minHeight: '20px'
        }}>
          {msg}
        </p>
      </form>
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '5px'
      }}>
        <strong>Usuarios de prueba:</strong>
        <div style={{ marginTop: '10px' }}>
          <button 
            type="button"
            onClick={() => { setEmail('admin@sofarlib.com'); setPassword('admin123'); }}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Admin
          </button>
          <button 
            type="button"
            onClick={() => { setEmail('regente@sofarlib.com'); setPassword('admin123'); }}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Regente
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;