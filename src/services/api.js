const API_URL = 'http://localhost/sofar_api';

const api = {
  // ==================== AUTENTICACIÓN ====================
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // ==================== MEDICAMENTOS ====================
  async meds(query = '') {
    try {
      let url = `${API_URL}/medicamentos/`;
      
      if (query.trim()) {
        url += `?search=${encodeURIComponent(query)}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('Error en medicamentos:', error);
      throw error;
    }
  },

  // ==================== VENTAS ====================
  async createVenta(ventaData) {
    try {
      console.log('🚀 Enviando venta a:', `${API_URL}/ventas/`);
      console.log('📦 Datos:', ventaData);
      
      const response = await fetch(`${API_URL}/ventas/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });
      
      console.log('📡 Status:', response.status);
      
      const text = await response.text();
      console.log('📄 Respuesta completa:', text);
      
      if (text.includes('<') || text.includes('Fatal error') || text.includes('Warning')) {
        throw new Error('El servidor devolvió HTML/Error en lugar de JSON');
      }
      
      const data = JSON.parse(text);
      console.log('✅ JSON parseado:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error en createVenta:', error);
      throw error;
    }
  },

  // ==================== COMPRAS ====================
  async createCompra(compraData) {
    try {
      console.log('🚀 Enviando compra a:', `${API_URL}/compras/`);
      console.log('📦 Datos:', compraData);
      
      const response = await fetch(`${API_URL}/compras/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(compraData)
      });
      
      console.log('📡 Status:', response.status);
      
      const text = await response.text();
      console.log('📄 Respuesta completa:', text);
      
      if (text.includes('<') || text.includes('Fatal error') || text.includes('Warning')) {
        throw new Error('El servidor devolvió HTML/Error en lugar de JSON');
      }
      
      const data = JSON.parse(text);
      console.log('✅ JSON parseado:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error en createCompra:', error);
      throw error;
    }
  },

  async getCompras() {
    try {
      const response = await fetch(`${API_URL}/compras/`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.compras || [];
      
    } catch (error) {
      console.error('Error obteniendo compras:', error);
      throw error;
    }
  }
};

export default api;