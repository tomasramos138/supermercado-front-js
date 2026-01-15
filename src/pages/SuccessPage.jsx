import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useVenta from '../hooks/useVenta';
import { useCart } from "../hooks/useCart";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const ventaId = searchParams.get('venta_id');
  
  const { getVentaById } = useVenta();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

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
    clearCart();
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

  return (
    <div style={{minHeight: '100vh', padding: '20px', textAlign: 'center'}}>
      <h1 style={{color: 'green'}}>¡PAGO EXITOSO!</h1>
      
      <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto'}}>
        <h2>Detalles del pedido</h2>
        
        <div style={{textAlign: 'left'}}>
          <p><strong>Pedido #:</strong> {venta.id}</p>
          <p><strong>Estado:</strong> {venta.estado}</p>
          <p><strong>Total:</strong> ${venta.total}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Cliente:</strong> {venta.cliente?.name} {venta.cliente?.apellido}</p>
          <p><strong>ID Pago Mercado Pago:</strong> {venta.pago_id}</p>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <p>Tu pedido fue confirmado exitosamente.</p>
        <div>
          
          <button 
            onClick={() => navigate('/products')}
            style={{margin: '5px', padding: '10px 20px', background: 'gray', color: 'white', border: 'none', borderRadius: '5px'}}
          >
            Seguir comprando
          </button>

        </div>
      </div>
    </div>
  );
};

export default SuccessPage;