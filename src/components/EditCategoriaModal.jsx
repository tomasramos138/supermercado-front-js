import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditCategoriaModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCategory,
  isSaving 
}) => {
  const { 
    register, 
    handleSubmit,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm();

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name || '',
        description: editingCategory.description || ''
      });
    }
  }, [editingCategory, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar categoría</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="form-categoria">
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" },
                pattern: { value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, message: "Solo se permiten letras y espacios" }
              })}
            />
            {errors?.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Descripción"
              {...register("description", {
                minLength: { value: 5, message: "La descripción debe tener al menos 5 caracteres" }
              })}
            />
            {errors?.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={isSaving || isSubmitting}>
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoriaModal;