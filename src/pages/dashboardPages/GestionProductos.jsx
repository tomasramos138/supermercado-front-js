import React, { useState, useMemo } from "react";
import useProducts from "../../hooks/useProducts";
import "./GestionProductos.css";
// Nota: También necesitarías los estilos de tu ProductList para el formulario
// import "../rutadondeestatusProductList/ProductList.css"; 

const Gestion_productos = () => {
  const {
    products,
    isLoading,
    isError,
    updateStock,
    updateProduct, // Esta función se usará para la edición
    refetchProducts,
  } = useProducts();

  const [editStock, setEditStock] = useState({});
  // 1. Estado para controlar la edición: guarda el objeto del producto a editar.
  const [editingProduct, setEditingProduct] = useState(null);
  // 2. Estado para manejar los campos del formulario de edición.
  const [editFormData, setEditFormData] = useState({});

  if (isLoading) return <div className="loading">Cargando productos...</div>;
  if (isError) return <div className="error">Error al cargar los productos</div>;

  // ------------------------------------------------------------------
  // --- Lógica de Edición (Nueva) ---
  // ------------------------------------------------------------------

  // Obtener la lista única de categorías de todos los productos (similar a tu ProductList)
  const categoriasUnicas = useMemo(() => {
    const activeProducts = products?.filter(p => p.estado) || [];
    const categories = [...new Set(activeProducts.map(p => p.categoria?.name || p.categoria?.id))];
    return categories.filter(c => c); // Filtrar valores vacíos
  }, [products]);
  
  // 1. Inicia la edición y setea el estado del formulario con los datos actuales
  const handleEditClick = (producto) => {
    setEditingProduct(producto);
    setEditFormData({
      name: producto.name || "",
      description: producto.description || "",
      price: producto.price || 0,
      image: producto.image || "",
      // Asume que la categoría puede ser por nombre o ID
      category: producto.categoria?.name || producto.categoria?.id || "", 
    });
  };

  // 2. Maneja cambios en los campos del formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // 3. Cancela la edición
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  // 4. Confirma la edición y actualiza la BD
  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
        
    try {
        const updatedFields = {
          name: editFormData.name,
          description: editFormData.description,
          price: editFormData.price,
          image: editFormData.image,
          category: editFormData.category, // Asegúrate de que este es el formato correcto para tu BD
        };

        // Llama a la función de tu hook para actualizar el producto
        await updateProduct({ id: editingProduct.id, ...updatedFields });
        alert("Producto actualizado correctamente");
        setEditingProduct(null); // Oculta el formulario
        refetchProducts(); // Refresca la lista de productos
    } catch (error) {
        console.error("Error actualizando producto:", error);
        alert("Error al actualizar el producto");
    }
  };

  // ------------------------------------------------------------------
  // --- Lógica de Stock y Estado (Mantenida) ---
  // ------------------------------------------------------------------

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

  // ------------------------------------------------------------------
  // --- Renderizado Condicional: Formulario o Tabla ---
  // ------------------------------------------------------------------

  // Si hay un producto en edición, mostramos el formulario de edición.
  if (editingProduct) {
    return (
      <div className="container">
        <h1 className="header">Editar Producto: {editingProduct.name} (ID: #{editingProduct.id})</h1>

        <form className="product-form" onSubmit={handleConfirmEdit}>
          
          {/* CAMPO: NOMBRE */}
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              required
              className="form-input"
            />
          </div>

          {/* CAMPO: DESCRIPCIÓN */}
          <div className="form-group">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              required
              className="form-textarea"
            ></textarea>
          </div>

          {/* CAMPO: PRECIO */}
          <div className="form-group">
            <label htmlFor="price">Precio:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editFormData.price}
              onChange={handleEditFormChange}
              min="0"
              step="0.01"
              required
              className="form-input"
            />
          </div>

          {/* CAMPO: IMAGEN (URL) */}
          <div className="form-group">
            <label htmlFor="image">URL de la Imagen:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={editFormData.image}
              onChange={handleEditFormChange}
              required
              className="form-input"
            />
          </div>

          {/* CAMPO: CATEGORÍA */}
          <div className="form-group">
            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              name="category"
              value={editFormData.category}
              onChange={handleEditFormChange}
              required
              className="form-select"
            >
              <option value="" disabled>Seleccione una categoría</option>
              {categoriasUnicas.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="form-actions">
            <button type="submit" className="btn-confirm">
              💾 Confirmar Edición
            </button>
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              className="btn-cancel"
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  // Si no hay edición, mostramos la tabla de gestión
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
                {/* NUEVA COLUMNA DE EDICIÓN */}
                <th>Editar</th>
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
                  {/* CELDA DE EDICIÓN */}
                  <td>
                    <button
                      onClick={() => handleEditClick(producto)}
                      title="Editar Producto"
                      className="btn-edit"
                    >
                      ✏️
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

export default Gestion_productos;