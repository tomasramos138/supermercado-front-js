import React, { useState } from "react";
import useProducts from "../../hooks/useProducts";
import "./NuevosProductos.css";

const NuevoProducto = () => {
  const { createProduct, isCreating } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    categoria_id: 0,
    precio: 0,
    imagen: null, // archivo
    stock: 0,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setFormData((prev) => ({
        ...prev,
        imagen: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "precio" || name === "stock" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await createProduct(data);
      alert("✅ Producto creado con éxito");
      setFormData({
        name: "",
        descripcion: "",
        categoria_id: 0,
        precio: 0,
        imagen: null,
        stock: 0,
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error al crear el producto");
    }
  };

  return (
    <div className="nuevo-producto-container">
      <h1>Agregar Nuevo Producto</h1>

      <form className="nuevo-producto-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Categoría (ID):</label>
          <input type="number" name="categoria_id" value={formData.categoria_id} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Imagen:</label>
          <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" required />
        </div>

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
};

export default NuevoProducto;
