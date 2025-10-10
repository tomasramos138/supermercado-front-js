import { useForm } from "react-hook-form";
import useProducts from "../../hooks/useProducts";
import "./NuevosProductos.css";
import useCategoria from "../../hooks/useCategoria";

const NuevoProducto = () => {
  const { createProduct, uploadImage } = useProducts();
  const { 
    categorias, 
    isLoading: loadingCategorias, 
    isError: categoriasError,
    error 
  } = useCategoria();
  
  const {
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      //1)Subir la imagen si existe
      let imageUrl = "";
      if (data.imagen && data.imagen[0]) {
        const uploadResult = await uploadImage(data.imagen[0]);
        imageUrl = `../imagenes/${uploadResult.filename}`;
      }

      //2)Preparar el objeto producto
      const productoData = {
        name: data.name,
        descripcion: data.descripcion,
        categoria: Number(data.categoria),
        precio: parseFloat(String(data.precio).replace(",", ".")),
        imagen: imageUrl,
        stock: Number(data.stock),
        estado: true,
      };

      //3)Crear producto
      await createProduct(productoData);
      alert("Producto creado con éxito");

      //4)Resetear formulario
      reset();
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear el producto");
    }
  };

  return (
    <div className="nuevo-producto-container">
      <h1>Agregar Nuevo Producto</h1>

      <form className="nuevo-producto-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            {...register("name", { required: "El nombre es obligatorio" })}
            type="text"
            placeholder="Nombre del producto"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            {...register("descripcion", { required: "La descripción es obligatoria" })}
            placeholder="Descripción del producto"
          />
          {errors.descripcion && <p className="error-message">{errors.descripcion.message}</p>}
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          {loadingCategorias ? (
            <p>Cargando categorías...</p>
          ) : categoriasError ? (
            <p className="error-message">
              Error al cargar categorías: {error?.message || "Error desconocido"}
            </p>
          ) : (
            <select
              {...register("categoria", { 
                required: "Debe seleccionar una categoría",
                validate: value => value !== "" || "Debe seleccionar una categoría"
              })}
            >
              <option value="">Seleccione una categoría</option>
              {categorias?.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre || categoria.name}
                </option>
              ))}
            </select>
          )}
          {errors.categoria && <p className="error-message">{errors.categoria.message}</p>}
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            step="any"
            inputMode="decimal"
            {...register("precio", {
              required: "Debe ingresar un precio",
              min: { value: 0, message: "El precio no puede ser negativo" },
            })}
            placeholder="Precio"
          />
          {errors.precio && <p className="error-message">{errors.precio.message}</p>}
        </div>

        <div className="form-group">
          <label>Imagen:</label>
          <input type="file" {...register("imagen")} accept="image/*" />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            min="0"
            {...register("stock", {
              required: "Debe ingresar el stock",
              min: { value: 0, message: "El stock no puede ser negativo" },
            })}
            placeholder="Stock disponible"
          />
          {errors.stock && <p className="error-message">{errors.stock.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || loadingCategorias || categoriasError}
        >
          {isSubmitting ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
};

export default NuevoProducto;