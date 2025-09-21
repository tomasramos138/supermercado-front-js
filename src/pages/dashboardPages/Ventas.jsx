import React, { useState } from 'react';
import useVenta from '../../hooks/useVenta';
import './Ventas.css';

const Ventas = () => {
  const { ventas, isLoading, isError } = useVenta();
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedRows, setExpandedRows] = useState({});

  if (isLoading) {
    return <div className="loading">Cargando ventas...</div>;
  }

  if (isError) {
    return <div className="error">Error al cargar las ventas</div>;
  }

  const sortedVentas = [...(ventas || [])].sort((a, b) => {
    return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
  });

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="ventas-container">
      <h1>Reporte de Ventas</h1>
      
      <div className="ventas-header">
        <h2>Lista de Ventas</h2>
        <div className="sort-controls">
          <span>Ordenar por precio: </span>
          <button 
            className={sortOrder === 'asc' ? 'active' : ''}
            onClick={() => setSortOrder('asc')}
          >
            Menor a Mayor
          </button>
          <button 
            className={sortOrder === 'desc' ? 'active' : ''}
            onClick={() => setSortOrder('desc')}
          >
            Mayor a Menor
          </button>
        </div>
      </div>

      <div className="ventas-table-container">
        {sortedVentas.length > 0 ? (
          <table className="ventas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Distribuidor</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedVentas.map((venta) => (
                <React.Fragment key={venta.id}>
                  <tr className="venta-row">
                    <td className="venta-id">#{venta.id}</td>
                    <td className="venta-fecha">{formatDate(venta.fecha)}</td>
                    <td className="venta-cliente">
                      {venta.cliente?.name || 'N/A'} {venta.cliente?.apellido || ''}
                      <br />
                      <small>Zona: {venta.cliente?.zona?.name || 'Sin zona'}</small>
                    </td>
                    <td className="venta-distribuidor">
                      {venta.distribuidor?.name || 'N/A'} {venta.distribuidor?.apellido || ''}
                      <br />
                      <small>Entrega: ${venta.distribuidor?.valorEntrega?.toFixed(2) || '0.00'}</small>
                    </td>
                    <td className="venta-total">${venta.total?.toFixed(2)}</td>
                    <td>
                      <button onClick={() => toggleRow(venta.id)}>
                        {expandedRows[venta.id] ? 'Ocultar Detalles' : 'Ver Detalles'}
                      </button>
                    </td>
                  </tr>

                  {expandedRows[venta.id] && (
                    <tr className="venta-detalles">
                      <td colSpan="6">
                        <h4>Productos:</h4>
                        {venta.itemsVenta && venta.itemsVenta.length > 0 ? (
                          <ul className="productos-list">
                            {venta.itemsVenta.map((item, index) => (
                              <li key={index} className="producto-item">
                                {item.cantidad} x {item.producto.name || 'Producto'} - ${item.precio?.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          'Sin productos'
                        )}
                        <p><strong>Cantidad de productos:</strong> {venta.itemsVenta?.reduce((acc, i) => acc + i.cantidad, 0) || 0}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-ventas">No hay ventas registradas</p>
        )}
      </div>
    </div>
  );
};

export default Ventas;