import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const data = await api.login(email, password);
      
      if (data && data.user) {
        localStorage.setItem('usuario', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setMsg('Error de conexión o credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  function loginAsAdmin() {
    setEmail('admin@sofarlib.com');
    setPassword('admin123');
  }

  function loginAsRegente() {
    setEmail('regente@sofarlib.com');
    setPassword('admin123');
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">🏥 SOFARLIB</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input 
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@sofarlib.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña:</label>
            <input 
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {msg && <div className="alert alert-error">{msg}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-buttons">
          <button onClick={loginAsAdmin} className="btn btn-secondary">
            Admin
          </button>
          <button onClick={loginAsRegente} className="btn btn-secondary">
            Regente
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;