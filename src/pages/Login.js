// Login.js - Prototipo de Login 


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // simulada 
    if (usuario === 'admin' && contrasena === '1234') { // Credenciales 
      navigate('/dashboard');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <h2>Inicio de Sesión - SOFARLIB</h2>
      <label htmlFor="usuario">Usuario:</label>
      <input
        type="text"
        id="usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Ingresa tu usuario" 
  

      />
        <br />
      <label htmlFor="contrasena">Contraseña:</label>
      <input
        type="password"
        id="contrasena"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        placeholder="Ingresa tu contraseña"
      />
        
      <button onClick={handleLogin}>Ingresar</button>
      <p><a href="#">¿Olvidaste tu contraseña?</a></p> 
    </div>
  );
}

export default Login;