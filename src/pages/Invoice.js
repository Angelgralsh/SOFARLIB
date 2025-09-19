import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Invoice() {
  const location = useLocation();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si viene de una venta, usar esos datos
    if (location.state?.ventaData) {
      setInvoice(location.state.ventaData);
      setLoading(false);
    } else {
      // Generar factura de ejemplo o cargar desde API
      generateSampleInvoice();
    }
  }, [location]);

  function generateSampleInvoice() {
    const sampleInvoice = {
      id: Math.floor(Math.random() * 1000) + 1,
      fecha: new Date().toISOString().split('T')[0],
      cliente: {
        nombre: 'Cliente Ejemplo',
        email: 'cliente@mail.com'
      },
      items: [
        {
          nombre: 'Med 101',
          precio: 175,
          cantidad: 1,
          total: 175
        },
        {
          nombre: 'Zocor',
          precio: 15.1,
          cantidad: 1,
          total: 15.1
        }
      ],
      subtotal: 190.1,
      descuento: 1,
      total: 189.1,
      pagado: 190
    };
    setInvoice(sampleInvoice);
    setLoading(false);
  }

  function printInvoice() {
    window.print();
  }

  if (loading) {
    return <div>Cargando factura...</div>;
  }

  if (!invoice) {
    return <div>No se pudo cargar la factura</div>;
  }

  return (
    <div className="invoice-container" style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header de la factura */}
      <div style={{
        background: '#5bc0de',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        Sales Medicine Invoice
      </div>

      {/* Botón de imprimir */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={printInvoice}
          style={{
            background: '#fff',
            border: '1px solid #ccc',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🖨️ Print
        </button>
      </div>

      {/* Contenido de la factura */}
      <div style={{
        border: '1px solid #ddd',
        padding: '20px',
        background: '#fff'
      }}>
        {/* Información principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #eee'
        }}>
          <div>
            <strong>INVOICE ID:</strong> {invoice.id}
          </div>
          <div>
            <strong>Customer Email:</strong> {invoice.cliente.email}
          </div>
          <div>
            <strong>Date:</strong> {invoice.fecha}
          </div>
        </div>

        {/* Detalles de medicamentos */}
        <div style={{ marginBottom: '20px' }}>
          <strong>Medicine Name and Price:</strong>{' '}
          {invoice.items.map((item, index) => (
            <span key={index}>
              {item.nombre} ({item.precio} $)
              {index < invoice.items.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </div>

        {/* Totales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #eee'
        }}>
          <div>
            <strong>Amount:</strong> ${invoice.subtotal.toFixed(1)}
          </div>
          <div>
            <strong>Discount:</strong> ${invoice.descuento.toFixed(1)}
          </div>
          <div>
            <strong>Sub Total:</strong> ${invoice.total.toFixed(0)}
          </div>
          <div>
            <strong>Amount Paid:</strong> ${invoice.pagado.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Tabla detallada (opcional) */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          margin: '0 0 10px 0',
          border: '1px solid #ddd' 
        }}>
          Detalle de Items
        </h4>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
                Medicamento
              </th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                Precio Unit.
              </th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                Cantidad
              </th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {item.nombre}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                  ${item.precio.toFixed(2)}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {item.cantidad}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
              <td colSpan="3" style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                Total General:
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                ${invoice.total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '15px',
        background: '#f8f9fa',
        border: '1px solid #ddd',
        fontSize: '12px',
        color: '#666'
      }}>
        © All Pharmacy System And Inventory System. 2017.
      </div>

      {/* Estilos para impresión */}
      <style jsx>{`
        @media print {
          .invoice-container {
            max-width: none !important;
            margin: 0 !important;
            padding: 10px !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Invoice;