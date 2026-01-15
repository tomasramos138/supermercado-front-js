import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useProducts from "../../hooks/useProducts";
import useCategoria from "../../hooks/useCategoria";
import EditProductModal from "../../components/EditProductModal";
import "./GestionProductos.css";

const Gestion_productos = () => {
  const { products, isLoading, isError, updateProduct, refetchProducts, searchProductsByName } = useProducts();
  const { categorias, isLoading: isLoadingCategorias } = useCategoria();

  const { register, watch } = useForm();
  const [editStock, setEditStock] = useState({});
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);

  const searchTerm = watch("searchTerm");

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm || !searchTerm.trim()) {
        setDisplayedProducts(products || []);
        return;
      }

      try {
        const result = await searchProductsByName(searchTerm);
        setDisplayedProducts(result || []);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setDisplayedProducts([]);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
  
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchProductsByName, products]);

  useEffect(() => {
    setDisplayedProducts(products || []);
  }, [products]);

  const handleStockChange = (id, value) => {
    const stockValue = Math.max(0, Number(value));
    setEditStock((prev) => ({ ...prev, [id]: stockValue }));
  };

  const handleSaveStock = async (id) => {
    const newStock = editStock[id];
    if (newStock !== undefined && !isNaN(newStock)) {
      try {
        await updateProduct({
          Productid: id,
          param: { stock: Number(newStock) }
        });
        alert("Stock actualizado correctamente");
        refetchProducts();
      } catch (error) {
        console.error("Error completo:", error);
        alert("Error al actualizar el stock");
      }
    }
  };

  const handleToggleEstado = async (id, currentEstado) => {
    try {
      const nuevoEstado = !currentEstado;
      await updateProduct({
        Productid: id,
        param: { estado: nuevoEstado }
      });
      refetchProducts();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error al cambiar el estado del producto");
    }
  };

  const openEditModal = (producto) => {
    setEditingProduct(producto);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditSubmit = async (data) => {
    if (!editingProduct) return;
  
    try {
      setIsProcessingUpdate(true);
      await updateProduct({
        Productid: editingProduct.id,
        param: {
          name: data.name,
          descripcion: data.descripcion,
          precio: parseFloat(data.precio),
          categoria: data.categoriaId
        }
      });
      refetchProducts();
      closeEditModal();
      alert('Producto actualizado exitosamente!');
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      alert("Error al actualizar el producto");
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  if (isLoading) return <div className="loading">Cargando productos...</div>;
  if (isError) return <div className="error">Error al cargar los productos</div>;

  return (
    <div className="stock-container">
      <h1>Gestión de Productos</h1>

      {/* Campo de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          {...register("searchTerm")}
          className="search-input"
        />
      </div>

      <div className="stock-table-container">
        {displayedProducts && displayedProducts.length > 0 ? (
          <table className="stock-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Guardar Stock</th>
                <th>Alta / Baja</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((producto) => (
                <tr
                  key={producto.id}
                  className={producto.estado ? "activo" : "inactivo"}
                >
                  <td>#{producto.id}</td>
                  <td>{producto.name}</td>
                  <td>{producto.categoria?.name || "Sin categoría"}</td>
                  <td>${producto.precio?.toFixed(2)}</td>
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
                  <td>
                    <button
                      className="product-edit"
                      onClick={() => openEditModal(producto)}
                      title="Editar producto"
                    >
                      ✎
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-productos">
            {searchTerm && searchTerm.trim()
              ? "No se encontraron productos con ese nombre"
              : "No hay productos registrados"
            }
          </p>
        )}
      </div>

      <EditProductModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSave={handleEditSubmit}
        editingProduct={editingProduct}
        categorias={categorias}
        isLoadingCategorias={isLoadingCategorias}
        isSaving={isProcessingUpdate}
      />
    </div>
  );
};

export default Gestion_productos;