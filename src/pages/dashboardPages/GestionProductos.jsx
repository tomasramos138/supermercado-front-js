import React, { useState } from "react";
import useProducts from "../../hooks/useProducts";
import "./GestionProductos.css";

const Gestion_productos = () => {
  const {
    products,
    isLoading,
    isError,
    updateStock,
    updateProduct,
    refetchProducts,
  } = useProducts();

  const [editStock, setEditStock] = useState({});

  if (isLoading) return <div className="loading">Cargando productos...</div>;
  if (isError) return <div className="error">Error al cargar los productos</div>;

  const handleStockChange = (id, value) => {
    const stockValue = Math.max(0, Number(value));
    setEditStock((prev) => ({ ...prev, [id]: stockValue }));
  };

  const handleSaveStock = async (id) => {
    const newStock = editStock[id];
    if (newStock !== undefined && !isNaN(newStock)) {
      try {
        await updateStock({ id, stock: Number(newStock) });
        alert("Stock actualizado correctamente");
        refetchProducts();
      } catch {
        alert("Error al actualizar el stock");
      }
    }
  };

  const handleToggleEstado = async (id, currentEstado) => {
    try {
      const nuevoEstado = !currentEstado;
      await updateProduct({ id, estado: nuevoEstado });
      refetchProducts();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error al cambiar el estado del producto");
    }
  };

  return (
    <div className="stock-container">
      <h1>Gestión de Productos</h1>

      <div className="stock-table-container">
        {products && products.length > 0 ? (
          <table className="stock-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Guardar Stock</th>
                <th>Alta / Baja</th>
              </tr>
            </thead>
            <tbody>
              {products.map((producto) => (
                <tr
                  key={producto.id}
                  className={producto.estado ? "activo" : "inactivo"}
                >
                  <td>#{producto.id}</td>
                  <td>{producto.name}</td>
                  <td>{producto.tipo}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={editStock[producto.id] ?? producto.stock}
                      onChange={(e) =>
                        handleStockChange(producto.id, e.target.value)
                      }
                      className="stock-input"
                      disabled={!producto.estado}
                    />
                  </td>
                  <td>
                    {producto.estado ? (
                      <span className="estado-activo">Activo</span>
                    ) : (
                      <span className="estado-inactivo">Inactivo</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleSaveStock(producto.id)}
                      disabled={!producto.estado}
                      className={!producto.estado ? "btn-disabled" : ""}
                    >
                      Guardar
                    </button>
                  </td>
                  <td>
                    <div className="role-checkbox">
                      <input
                        type="checkbox"
                        id={`estado-switch-${producto.id}`}
                        checked={producto.estado}
                        onChange={() =>
                          handleToggleEstado(producto.id, producto.estado)
                        }
                      />
                      <label htmlFor={`estado-switch-${producto.id}`}></label>
                      <span>{producto.estado ? "Alta" : "Baja"}</span>
                    </div>
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

export default Gestion_productos;