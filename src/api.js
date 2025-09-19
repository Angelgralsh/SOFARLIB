const API_URL = 'http://localhost/sofar_api';

const api = {
  // Login de usuario
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
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Obtener medicamentos usando tu estructura existente
  async meds() {
    try {
      console.log('Llamando a:', `${API_URL}/medicamentos/`);
      
      const response = await fetch(`${API_URL}/medicamentos/`, {
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
      console.log('Medicamentos recibidos:', data);
      
      // Adaptar los datos a lo que espera el frontend
      const medicamentos = data.map(med => ({
        id: med.id,
        codigo: med.codigo,
        nombre: med.nombre,
        precio: 0, // Tu sistema no tiene precio en medicamentos, usaremos 0 por defecto
        stock: med.stock_total || 0,
        stock_minimo: med.stock_min || 0,
        laboratorio: med.laboratorio || '',
        descripcion: `${med.gramos || ''}mg`,
        activo: med.activo
      }));
      
      return medicamentos;
      
    } catch (error) {
      console.error('Error en api.meds():', error);
      throw error;
    }
  },

  // Procesar venta usando tu estructura
  async venta(ventaData) {
    try {
      console.log('Enviando venta a:', `${API_URL}/ventas/`);
      console.log('Datos:', ventaData);
      
      const response = await fetch(`${API_URL}/ventas/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Respuesta de venta:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error en venta:', error);
      throw error;
    }
  }
};

export default api;