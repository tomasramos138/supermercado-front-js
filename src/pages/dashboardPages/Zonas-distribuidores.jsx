import { useForm } from 'react-hook-form';
import useZonas from '../../hooks/useZonas';
import useDistribuidor from '../../hooks/useDistribuidor';
import './Zonas-distribuidores.css';

const ZonaDistribuidor = () => {
  const { createZona } = useZonas();
  const { createDistribuidor } = useDistribuidor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1)Crear la zona primero
      const zonaData = {
        name: data.zonaName,
        description: data.zonaDescription
      };

      const zonaCreada = await createZona(zonaData);
      console.log('Zona creada:', zonaCreada);

      // 2)Crear el distribuidor asociado a la zona
      const distribuidorData = {
        name: data.distribuidorName,
        apellido: data.distribuidorApellido,
        dni: data.distribuidorDni,
        valorEntrega: parseFloat(data.distribuidorValorEntrega),
        zona: zonaCreada.data.id
      };

      const distribuidorCreado = await createDistribuidor(distribuidorData);
      console.log('Distribuidor creado:', distribuidorCreado);

      reset();
      alert('Zona y distribuidor creados exitosamente!');

    } catch (error) {
      console.error('Error al crear zona y distribuidor:', error);
      setError('root', {
        type: 'manual',
        message: 'Error al crear la zona y distribuidor'
      });
    }
  };

  return (
    <div className="nuevo-producto-container">
      <h1>Crear Nueva Zona con Distribuidor</h1>

      <form className="nuevo-producto-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && <p className="error-message">{errors.root.message}</p>}

        {/* Sección Zona */}
        <div className="form-section">
          <h3>Datos de la Zona</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre de la Zona:</label>
              <input
                {...register("zonaName", { 
                  required: "El nombre de la zona es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  }
                })}
                type="text"
                placeholder="Nombre de la zona"
              />
              {errors.zonaName && <p className="error-message">{errors.zonaName.message}</p>}
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <input
                {...register("zonaDescription", { 
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 5,
                    message: "La descripción debe tener al menos 5 caracteres"
                  }
                })}
                type="text"
                placeholder="Descripción de la zona"
              />
              {errors.zonaDescription && <p className="error-message">{errors.zonaDescription.message}</p>}
            </div>
          </div>
        </div>

        {/* Sección Distribuidor */}
        <div className="form-section">
          <h3>Datos del Distribuidor</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                {...register("distribuidorName", { 
                  required: "El nombre del distribuidor es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                    message: "Solo se permiten letras y espacios"
                  }
                })}
                type="text"
                placeholder="Nombre del distribuidor"
              />
              {errors.distribuidorName && <p className="error-message">{errors.distribuidorName.message}</p>}
            </div>

            <div className="form-group">
              <label>Apellido:</label>
              <input
                {...register("distribuidorApellido", { 
                  required: "El apellido del distribuidor es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                    message: "Solo se permiten letras y espacios"
                  }
                })}
                type="text"
                placeholder="Apellido del distribuidor"
              />
              {errors.distribuidorApellido && <p className="error-message">{errors.distribuidorApellido.message}</p>}
            </div>

            <div className="form-group">
              <label>DNI:</label>
              <input
                {...register("distribuidorDni", { 
                  required: "El DNI es obligatorio",
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: "El DNI debe tener 7 u 8 dígitos"
                  }
                })}
                type="text"
                placeholder="12345678"
              />
              {errors.distribuidorDni && <p className="error-message">{errors.distribuidorDni.message}</p>}
            </div>

            <div className="form-group">
              <label>Valor de Entrega:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("distribuidorValorEntrega", { 
                  required: "El valor de entrega es obligatorio",
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0"
                  }
                })}
                placeholder="0.00"
              />
              {errors.distribuidorValorEntrega && <p className="error-message">{errors.distribuidorValorEntrega.message}</p>}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear Zona y Distribuidor"}
        </button>
      </form>
    </div>
  );
};

export default ZonaDistribuidor;

