import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditProductModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingProduct,
  categorias,
  isLoadingCategorias,
  isSaving 
}) => {
  const { 
    register, 
    handleSubmit,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm();

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name || '',
        descripcion: editingProduct.descripcion || '',
        precio: editingProduct.precio || 0,
        categoriaId: editingProduct.categoria?.id || ""
      });
    }
  }, [editingProduct, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar Producto</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="form-producto">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" }
                })}
              />
              {errors?.name && <p className="error-message">{errors.name.message}</p>}
            </div>

            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("precio", {
                  required: "El precio es obligatorio",
                  min: { value: 0, message: "El precio debe ser mayor o igual a 0" }
                })}
              />
              {errors?.precio && <p className="error-message">{errors.precio.message}</p>}
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <select
                {...register("categoriaId", {
                  required: "La categoría es obligatoria"
                })}
                className="category-select"
                disabled={isLoadingCategorias}
              >
                <option value="">Seleccionar categoría</option>
                {categorias?.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
              {errors?.categoriaId && <p className="error-message">{errors.categoriaId.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              rows="3"
              {...register("descripcion", {
                required: "La descripción es obligatoria",
                minLength: { value: 5, message: "La descripción debe tener al menos 5 caracteres" }
              })}
            />
            {errors?.descripcion && <p className="error-message">{errors.descripcion.message}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={isSaving || isSubmitting || isLoadingCategorias}>
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;