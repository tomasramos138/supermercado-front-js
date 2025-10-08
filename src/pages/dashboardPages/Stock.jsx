import React, { useState } from 'react';
import useProducts from '../../hooks/useProducts';
import './Stock.css';

const Stock = () => {
  const { products, isLoading, isError, updateStock } = useProducts();
  const [editStock, setEditStock] = useState({}); 

  if (isLoading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (isError) {
    return <div className="error">Error al cargar los productos</div>;
  }

  const handleStockChange = (id, value) => {
    // Para que no nos deje ingresar un stock negativo
    const stockValue = Math.max(0, Number(value));
    setEditStock((prev) => ({
      ...prev,
      [id]: stockValue,
    }));
  };

  const handleSaveStock = async (id) => {
    const newStock = editStock[id];
    if (newStock !== undefined && !isNaN(newStock)) {
      try {
        await updateStock({ id, stock: Number(newStock) });
        alert('Stock actualizado correctamente');
      } catch {
        alert('Error al actualizar el stock');
      }
    }
  };

  return (
    <div className="stock-container">
      <h1>Gestión de Stock</h1>
      
      <div className="stock-table-container">
        {products && products.length > 0 ? (
          <table className="stock-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Stock Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((producto) => (
                <tr key={producto.id} className="producto-row">
                  <td className="producto-id">#{producto.id}</td>
                  <td className="producto-nombre">{producto.name}</td>
                  <td className="producto-tipo">{producto.tipo}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={
                        editStock[producto.id] !== undefined
                          ? editStock[producto.id]
                          : producto.stock
                      }
                      onChange={(e) => handleStockChange(producto.id, e.target.value)}
                      className="stock-input"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSaveStock(producto.id)}>
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-productos">No hay productos registrados</p>
        )}
      </div>
    </div>
  );
};

export default Stock;
