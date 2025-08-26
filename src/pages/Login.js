// Login.js - Prototipo de Login (PDF página 9).
// Cumple diagrama casos de uso: Inicio sesión, recuperación contraseña (opcional).
// Accesibilidad: Labels, placeholders (RNF4).

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Lógica simulada (conectar API REST del PDF página 8).
    if (usuario === 'admin' && contrasena === '1234') { // Credenciales simuladas
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
      <label htmlFor="contrasena">Contraseña:</label>
      <input
        type="password"
        id="contrasena"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        placeholder="Ingresa tu contraseña"
      />
      <button onClick={handleLogin}>Ingresar</button>
      <p><a href="#">¿Olvidaste tu contraseña?</a></p> // Opcional (PDF)
    </div>
  );
}

export default Login;