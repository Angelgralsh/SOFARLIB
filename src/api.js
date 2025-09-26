const API_URL = 'http://localhost/sofar_api';

const api = {
  // ==================== AUTENTICACIÓN ====================
  
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} Datos del usuario autenticado
   */
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
  
  /**
   * Obtener lista de medicamentos
   * @param {string} query - Término de búsqueda opcional
   * @returns {Promise} Array de medicamentos
   */
  async meds(query = '') {
    try {
      let url = `${API_URL}/medicamentos/`;
      
      // Si hay término de búsqueda, agregarlo como parámetro
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
      
      // Asegurar que siempre devuelva un array
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('Error en medicamentos:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo medicamento
   * @param {Object} medicamento - Datos del medicamento
   * @returns {Promise} Medicamento creado
   */
  async createMedicamento(medicamento) {
    try {
      const response = await fetch(`${API_URL}/medicamentos/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(medicamento)
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
      console.error('Error creando medicamento:', error);
      throw error;
    }
  },

  // ==================== VENTAS ====================
  
  /**
   * Crear nueva venta
   * @param {Object} ventaData - Datos de la venta
   * @returns {Promise} Venta creada
   */
  async createVenta(ventaData) {
    try {
      const response = await fetch(`${API_URL}/ventas/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ventaData)
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
      console.error('Error creando venta:', error);
      throw error;
    }
  },

  /**
   * Obtener historial de ventas
   * @param {string} fecha - Fecha opcional para filtrar
   * @returns {Promise} Array de ventas
   */
  async getVentas(fecha = '') {
    try {
      let url = `${API_URL}/ventas/`;
      
      if (fecha) {
        url += `?fecha=${encodeURIComponent(fecha)}`;
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
      console.error('Error obteniendo ventas:', error);
      throw error;
    }
  },

  // ==================== COMPRAS ====================
  
  /**
   * Registrar nueva compra
   * @param {Object} compraData - Datos de la compra
   * @returns {Promise} Compra registrada
   */
  async createCompra(compraData) {
    try {
      const response = await fetch(`${API_URL}/compras/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(compraData)
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
      console.error('Error registrando compra:', error);
      throw error;
    }
  },

  /**
   * Obtener historial de compras
   * @returns {Promise} Array de compras
   */
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
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('Error obteniendo compras:', error);
      throw error;
    }
  },

  // ==================== UTILIDADES ====================
  
  /**
   * Verificar estado del servidor
   * @returns {Promise} Estado del servidor
   */
  async ping() {
    try {
      const response = await fetch(`${API_URL}/ping.php`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error verificando servidor:', error);
      throw new Error('Servidor no disponible');
    }
  }
};

export default api;