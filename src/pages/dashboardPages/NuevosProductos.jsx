import { useState } from "react";
import useProducts from "../../hooks/useProducts";
import "./NuevosProductos.css";

const NuevoProducto = () => {
  const { createProduct, uploadImage } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    categoria: "",
    precio: 0.00,
    imagen: "",
    stock: "",
  });

  const [isUploading, setIsUploading] = useState(false);

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
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      // Subir la imagen si existe
      let imageUrl = "";
      if (formData.imagen) {
        const uploadResult = await uploadImage(formData.imagen);
        imageUrl = `../imagenes/${uploadResult.filename}`;
      }

      // Convertir los valores numéricos correctamente
      const productoData = {
        name: formData.name,
        descripcion: formData.descripcion,
        categoria: Number(formData.categoria),
        precio: parseFloat(
          String(formData.precio).replace(",", ".") // por si usa coma
        ),
        imagen: imageUrl,
        stock: Number(formData.stock),
      };

      // Crear producto
      await createProduct(productoData);

      alert("Producto creado con éxito");

      // Resetear formulario
      setFormData({
        name: "",
        descripcion: "",
        categoria: "",
        precio: "",
        imagen: "",
        stock: "",
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear el producto");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="nuevo-producto-container">
      <h1>Agregar Nuevo Producto</h1>

      <form className="nuevo-producto-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría (ID):</label>
          <input
            type="number"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="any"        // Permite decimales
            inputMode="decimal" // ayuda en móviles
            required
          />
        </div>

        <div className="form-group">
          <label>Imagen:</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Creando..." : "Crear Producto"}
        </button>

        {isUploading && <p>Subiendo imagen y creando producto...</p>}
      </form>
    </div>
  );
};

export default NuevoProducto;