import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditZonaModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingZona,
  isSaving 
}) => {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm();

  useEffect(() => {
    if (editingZona) {
      const distribuidor = editingZona.distribuidores?.[0];
      reset({
        zonaName: editingZona.name,
        zonaDescription: editingZona.description,
        distribuidorName: distribuidor?.name || '',
        distribuidorApellido: distribuidor?.apellido || '',
        distribuidorDni: distribuidor?.dni || '',
        distribuidorValorEntrega: distribuidor?.valorEntrega || 0
      });
    }
  }, [editingZona, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar Zona y Distribuidor</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="form-zona-distribuidor">
          
          <div className="form-section">
            <h4>Datos de la Zona</h4>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre de la zona"
                {...register("zonaName", { required: "El nombre de la zona es obligatorio" })}
              />
              {errors?.zonaName && <p className="error-message">{errors.zonaName.message}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Descripción de la zona"
                {...register("zonaDescription", { required: "La descripción es obligatoria" })}
              />
              {errors?.zonaDescription && <p className="error-message">{errors.zonaDescription.message}</p>}
            </div>
          </div>

          <div className="form-section">
            <h4>Datos del Distribuidor</h4>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre del distribuidor"
                {...register("distribuidorName", { required: "El nombre del distribuidor es obligatorio" })}
              />
              {errors?.distribuidorName && <p className="error-message">{errors.distribuidorName.message}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Apellido del distribuidor"
                {...register("distribuidorApellido", { required: "El apellido del distribuidor es obligatorio" })}
              />
              {errors?.distribuidorApellido && <p className="error-message">{errors.distribuidorApellido.message}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="DNI (12345678)"
                {...register("distribuidorDni", { 
                  required: "El DNI es obligatorio",
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: "El DNI debe tener 7 u 8 dígitos"
                  }
                })}
              />
              {errors?.distribuidorDni && <p className="error-message">{errors.distribuidorDni.message}</p>}
            </div>

            <div className="form-group">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Valor de entrega (0.00)"
                {...register("distribuidorValorEntrega", { 
                  required: "El valor de entrega es obligatorio",
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0"
                  }
                })}
              />
              {errors?.distribuidorValorEntrega && <p className="error-message">{errors.distribuidorValorEntrega.message}</p>}
            </div>
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

export default EditZonaModal;