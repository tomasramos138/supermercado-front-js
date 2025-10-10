import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useZonas from '../../hooks/useZonas';
import useDistribuidor from '../../hooks/useDistribuidor';
import './Zonas-distribuidores.css';

const ZonaDistribuidor = () => {
  const { 
    createZona, 
    deleteZona, 
    zonas,
    isLoading, 
    refetchZonas,
    updateZona,
    searchZonasByName,
  } = useZonas();
  
  const { 
    createDistribuidor, 
    deleteDistribuidor,
    updateDistribuidor
  } = useDistribuidor();

  // Form para crear nueva zona y distribuidor
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError
  } = useForm();

  // Form para editar zona y distribuidor en modal
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit }
  } = useForm();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingZona, setEditingZona] = useState(null);
  const [editingDistribuidor, setEditingDistribuidor] = useState(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedZonas, setDisplayedZonas] = useState([]);

  // Sincronizar displayedZonas con zonas
  useEffect(() => {
    setDisplayedZonas(zonas || []);
  }, [zonas]);

  // Función para manejar la búsqueda
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      // Si no hay término, mostrar todas las zonas
      setDisplayedZonas(zonas || []);
    } else {
      // Buscar zonas por nombre
      try {
        const result = await searchZonasByName(term);
        setDisplayedZonas(result || []);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setDisplayedZonas([]);
      }
    }
  };

  // Función para limpiar búsqueda y recargar
  const handleRefetch = () => {
    setSearchTerm(""); // Limpiar el textbox
    refetchZonas();
  };

  const onSubmit = async (data) => {
    try {
      // 1) Crear la zona primero
      const zonaData = {
        name: data.zonaName,
        description: data.zonaDescription
      };

      const zonaCreada = await createZona(zonaData);
      console.log('Zona creada:', zonaCreada);

      // 2) Crear el distribuidor asociado a la zona
      const distribuidorData = {
        name: data.distribuidorName,
        apellido: data.distribuidorApellido,
        dni: data.distribuidorDni,
        valorEntrega: parseFloat(data.distribuidorValorEntrega),
        zona: zonaCreada.data.id
      };

      const distribuidorCreado = await createDistribuidor(distribuidorData);
      console.log('Distribuidor creado:', distribuidorCreado);

      // Refetch para actualizar la lista de zonas Y limpiar búsqueda
      handleRefetch();
      
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

  const handleDelete = async (zonaId, distribuidorId) => {
    const ok = window.confirm("¿Eliminar esta zona y su distribuidor asociado?");
    if (!ok) return;
    
    try {
      setIsProcessingDelete(true);
      
      // PRIMERO eliminar la ZONA
      await deleteZona(zonaId);
      
      // LUEGO eliminar el DISTRIBUIDOR
      if (distribuidorId) {
        await deleteDistribuidor(distribuidorId);
      }
      console.log('Zona y distribuidor eliminados');
      handleRefetch();
     
    } catch (err) {
      console.error("Error al eliminar zona y distribuidor:", err);
      alert("Error al eliminar. Por favor, intenta nuevamente.");
    } finally {
      setIsProcessingDelete(false);
    }
  };

  const openEditModal = (zona) => {
    setEditingZona(zona);
    
    // Obtener el distribuidor desde la propiedad distribuidores de la zona
    const distribuidorAsociado = zona.distribuidores && zona.distribuidores.length > 0 
      ? zona.distribuidores[0] 
      : null;
    
    setEditingDistribuidor(distribuidorAsociado);

    // Set valores iniciales del form de edición
    resetEdit({
      zonaName: zona.name,
      zonaDescription: zona.description,
      distribuidorName: distribuidorAsociado?.name || '',
      distribuidorApellido: distribuidorAsociado?.apellido || '',
      distribuidorDni: distribuidorAsociado?.dni || '',
      distribuidorValorEntrega: distribuidorAsociado?.valorEntrega || 0
    });
    
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingZona(null);
    setEditingDistribuidor(null);
    resetEdit();
  };

  const onEditSubmit = async (data) => {
    if (!editingZona) return;
    
    try {
      setIsProcessingUpdate(true);

      const zonaData = {
        name: data.zonaName,
        description: data.zonaDescription
      };
      await updateZona(editingZona.id, zonaData);

      if (editingDistribuidor) {
        const distribuidorData = {
          name: data.distribuidorName,
          apellido: data.distribuidorApellido,
          dni: data.distribuidorDni,
          valorEntrega: parseFloat(data.distribuidorValorEntrega),
          zona: editingZona.id
        };
        await updateDistribuidor(editingDistribuidor.id, distribuidorData);
      }

      handleRefetch();
      
      closeEditModal();
      alert('Zona y distribuidor actualizados exitosamente!');
      
    } catch (err) {
      console.error("Error al actualizar zona y distribuidor:", err);
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  // Función para obtener el distribuidor de una zona
  const getDistribuidorByZona = (zona) => {
    return zona.distribuidores && zona.distribuidores.length > 0 
      ? zona.distribuidores[0] 
      : null;
  };

  if (isLoading) return <p className="loading-message">Cargando zonas...</p>;

  return (
    <div className="zonas-distribuidores-container">
      <h1>Gestión de Zonas y Distribuidores</h1>

      {/* Campo de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar zonas por nombre..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Listado de Zonas con sus Distribuidores */}
      <div className="zonas-list">
        <h2>Zonas y Distribuidores Existentes</h2>
        {displayedZonas && displayedZonas.length > 0 ? (
          displayedZonas.map((zona) => {
            const distribuidor = getDistribuidorByZona(zona);
            return (
              <div key={zona.id} className="zona-card">
                <div className="zona-actions">
                  <button
                    className="zona-delete"
                    onClick={() => handleDelete(zona.id, distribuidor?.id)}
                    disabled={isProcessingDelete}
                    title="Eliminar zona y distribuidor"
                  >
                    ✖
                  </button>
                  <button
                    className="zona-edit"
                    onClick={() => openEditModal(zona)}
                    title="Editar zona y distribuidor"
                  >
                    ✎
                  </button>
                </div>
                
                <div className="zona-info">
                  <div className="zona-nombre">
                    <strong>Zona:</strong> {zona.name}
                  </div>
                  <div className="zona-descripcion">
                    <strong>Descripción:</strong> {zona.description}
                  </div>
                </div>

                {distribuidor ? (
                  <div className="distribuidor-info">
                    <div className="distribuidor-nombre">
                      <strong>Distribuidor:</strong> {distribuidor.name} {distribuidor.apellido}
                    </div>
                    <div className="distribuidor-dni">
                      <strong>DNI:</strong> {distribuidor.dni}
                    </div>
                    <div className="distribuidor-valor">
                      <strong>Valor de Entrega:</strong> ${distribuidor.valorEntrega}
                    </div>
                  </div>
                ) : (
                  <div className="distribuidor-info empty">
                    <em>No hay distribuidor asociado a esta zona</em>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            {searchTerm ? "No se encontraron zonas con ese nombre" : "No hay zonas creadas. Crea la primera zona con su distribuidor."}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Zona y Distribuidor</h3>
            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="form-zona-distribuidor">
              
              {/* Sección Zona en Modal */}
              <div className="form-section">
                <h4>Datos de la Zona</h4>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Nombre de la zona"
                    {...registerEdit("zonaName", { 
                      required: "El nombre de la zona es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres"
                      }
                    })}
                  />
                  {errorsEdit?.zonaName && <p className="error-message">{errorsEdit.zonaName.message}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Descripción de la zona"
                    {...registerEdit("zonaDescription", { 
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 5,
                        message: "La descripción debe tener al menos 5 caracteres"
                      }
                    })}
                  />
                  {errorsEdit?.zonaDescription && <p className="error-message">{errorsEdit.zonaDescription.message}</p>}
                </div>
              </div>

              {/* Sección Distribuidor Modal */}
              <div className="form-section">
                <h4>Datos del Distribuidor</h4>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Nombre del distribuidor"
                    {...registerEdit("distribuidorName", { 
                      required: "El nombre del distribuidor es obligatorio",
                      pattern: {
                      value: /^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s]+$/,
                      message: "Solo se permiten letras, números y espacios"
                      }
                    })}
                  />
                  {errorsEdit?.distribuidorName && <p className="error-message">{errorsEdit.distribuidorName.message}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Apellido del distribuidor"
                    {...registerEdit("distribuidorApellido", { 
                      required: "El apellido del distribuidor es obligatorio",
                      pattern: {
                      value: /^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s]+$/,
                      message: "Solo se permiten letras, números y espacios"
                      }
                    })}
                  />
                  {errorsEdit?.distribuidorApellido && <p className="error-message">{errorsEdit.distribuidorApellido.message}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="DNI (12345678)"
                    {...registerEdit("distribuidorDni", { 
                      required: "El DNI es obligatorio",
                      pattern: {
                        value: /^\d{7,8}$/,
                        message: "El DNI debe tener 7 u 8 dígitos"
                      }
                    })}
                  />
                  {errorsEdit?.distribuidorDni && <p className="error-message">{errorsEdit.distribuidorDni.message}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Valor de entrega (0.00)"
                    {...registerEdit("distribuidorValorEntrega", { 
                      required: "El valor de entrega es obligatorio",
                      min: {
                        value: 0,
                        message: "El valor debe ser mayor o igual a 0"
                      }
                    })}
                  />
                  {errorsEdit?.distribuidorValorEntrega && <p className="error-message">{errorsEdit.distribuidorValorEntrega.message}</p>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal}>Cancelar</button>
                <button type="submit" disabled={isProcessingUpdate || isSubmittingEdit}>
                  {isProcessingUpdate ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulario para crear nueva zona y distribuidor */}
      <div className="nueva-zona-distribuidor">
        <h2>Crear Nueva Zona con Distribuidor</h2>

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
                      value: /^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s]+$/,
                      message: "Solo se permiten letras, números y espacios"
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
                      value: /^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s]+$/,
                      message: "Solo se permiten letras, números y espacios"
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
    </div>
  );
};

export default ZonaDistribuidor;