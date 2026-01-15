import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useVenta from '../hooks/useVenta';

const FailurePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const ventaId = searchParams.get('venta_id');
  const paymentIdFromUrl = searchParams.get('payment_id');
  const reason = searchParams.get('reason') || 'rechazado';
  
  const { getVentaById } = useVenta();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ventaId) {
      setLoading(false);
      return;
    }

    const fetchVenta = async () => {
      try {
        const data = await getVentaById(ventaId);
        setVenta(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [ventaId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!ventaId || !venta) {
    return (
      <div>
        <h1>Error: No se encontró la venta</h1>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  // Usar pagoId de la venta si existe, sino de la URL
  const pagoId = venta.pagoId || paymentIdFromUrl;

  // Traducir motivo
  const getMotivo = () => {
    switch(reason) {
      case 'rejected': return 'Rechazado';
      case 'cancelled': return 'Cancelado';
      case 'expired': return 'Expirado';
      case 'pending': return 'Pendiente';
      default: return reason.charAt(0).toUpperCase() + reason.slice(1);
    }
  };

  return (
    <div style={{minHeight: '100vh', padding: '20px', textAlign: 'center'}}>
      <h1 style={{color: 'red'}}>¡PAGO FALLIDO!</h1>
      
      <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto'}}>
        <h2>Detalles del pedido</h2>
        
        <div style={{textAlign: 'left'}}>
          <p><strong>Pedido #:</strong> {venta.id}</p>
          <p><strong>Estado:</strong> {venta.estado}</p>
          <p><strong>Motivo:</strong> {getMotivo()}</p>
          <p><strong>Total:</strong> ${venta.total}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Cliente:</strong> {venta.cliente?.name} {venta.cliente?.apellido}</p>
          <p><strong>ID Pago Mercado Pago:</strong> {venta.p}</p>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <p>El pago no pudo ser procesado. No se realizó ningún cargo.</p>
        
        <div style={{marginTop: '20px'}}>
          <button 
            onClick={() => navigate('/products')}
            style={{margin: '5px', padding: '10px 20px', background: 'gray', color: 'white', border: 'none', borderRadius: '5px'}}
          >
            Volver al inicio
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default FailurePage;