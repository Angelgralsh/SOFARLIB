import { useState, useEffect } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('usuario');
    
    if (loggedIn && userData) {
      setIsLoggedIn(true);
      setUsuario(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');
    setIsLoggedIn(false);
    setUsuario(null);
  };

  return { isLoggedIn, usuario, loading, logout };
}