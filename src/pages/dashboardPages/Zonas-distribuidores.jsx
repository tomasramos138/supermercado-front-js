import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useZonas from '../../hooks/useZonas';
import useDistribuidor from '../../hooks/useDistribuidor';
import EditZonaModal from '../../components/EditZonaModal';
import './Zonas-distribuidores.css';

const ZonaDistribuidor = () => {
  const { createZona, deleteZona, zonas, isLoading, refetchZonas, updateZona, searchZonasByName } = useZonas();
  
  const { createDistribuidor, updateDistribuidor } = useDistribuidor();

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingZona, setEditingZona] = useState(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedZonas, setDisplayedZonas] = useState([]);

  useEffect(() => {
    setDisplayedZonas(zonas || []);
  }, [zonas]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setDisplayedZonas(zonas || []);
    } else {
      try {
        const result = await searchZonasByName(term);
        setDisplayedZonas(result || []);
      } catch {
        setDisplayedZonas([]);
      }
    }
  };

  const handleRefetch = async () => {
    setSearchTerm("");
    await refetchZonas();
  };

  const onSubmit = async (data) => {
    try {
      const zonaData = { name: data.zonaName, description: data.zonaDescription };
      const zonaCreada = await createZona(zonaData);

      await createDistribuidor({
        name: data.distribuidorName,
        apellido: data.distribuidorApellido,
        dni: data.distribuidorDni,
        valorEntrega: parseFloat(data.distribuidorValorEntrega),
        zona: zonaCreada.data.id
      });

      await handleRefetch();
      reset();
      alert('Zona y distribuidor creados exitosamente!');
    } catch {
      alert('Error al crear la zona y distribuidor');
    }
  };

  const handleDelete = async (zonaId) => {
    if (!window.confirm("¿Eliminar esta zona? Los distribuidores asociados también se eliminarán.")) return;
    
    try {
      setIsProcessingDelete(true);
      const response = await deleteZona(zonaId);
      
      if (response?.message?.includes('No se puede eliminar')) {
        alert(response.message);
        return;
      }
      
      await handleRefetch();
      alert('Zona eliminada correctamente');
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la zona.");
    } finally {
      setIsProcessingDelete(false);
    }
  };

  const openEditModal = (zona) => {
    setEditingZona(zona);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingZona(null);
  };

  const handleEditSubmit = async (data) => {
    if (!editingZona) return;
    
    try {
      setIsProcessingUpdate(true);

      await updateZona(editingZona.id, {
        name: data.zonaName,
        description: data.zonaDescription
      });

      const distribuidor = editingZona.distribuidores?.[0];
      if (distribuidor) {
        await updateDistribuidor(distribuidor.id, {
          name: data.distribuidorName,
          apellido: data.distribuidorApellido,
          dni: data.distribuidorDni,
          valorEntrega: parseFloat(data.distribuidorValorEntrega),
          zona: editingZona.id
        });
      }

      await handleRefetch();
      closeEditModal();
      alert('Zona y distribuidor actualizados exitosamente!');
    } catch {
      alert('Error al actualizar');
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  if (isLoading) return <p className="loading-message">Cargando zonas...</p>;

  return (
    <div className="zonas-distribuidores-container">
      <h1>Gestión de Zonas y Distribuidores</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar zonas por nombre..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="zonas-list">
        <h2>Zonas y Distribuidores Existentes</h2>
        {displayedZonas?.length > 0 ? (
          displayedZonas.map((zona) => (
            <div key={zona.id} className="zona-card">
              <div className="zona-actions">
                <button className="zona-delete" onClick={() => handleDelete(zona.id)} disabled={isProcessingDelete}>
                  ✖
                </button>
                <button className="zona-edit" onClick={() => openEditModal(zona)}>
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

              {zona.distribuidores?.[0] ? (
                <div className="distribuidor-info">
                  <div className="distribuidor-nombre">
                    <strong>Distribuidor:</strong> {zona.distribuidores[0].name} {zona.distribuidores[0].apellido}
                  </div>
                  <div className="distribuidor-dni">
                    <strong>DNI:</strong> {zona.distribuidores[0].dni}
                  </div>
                  <div className="distribuidor-valor">
                    <strong>Valor de Entrega:</strong> ${zona.distribuidores[0].valorEntrega}
                  </div>
                </div>
              ) : (
                <div className="distribuidor-info empty">
                  <em>No hay distribuidor asociado a esta zona</em>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            {searchTerm ? "No se encontraron zonas con ese nombre" : "No hay zonas creadas. Crea la primera zona con su distribuidor."}
          </div>
        )}
      </div>

      <EditZonaModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSave={handleEditSubmit}
        editingZona={editingZona}
        isSaving={isProcessingUpdate}
      />

      <div className="nueva-zona-distribuidor">
        <h2>Crear Nueva Zona con Distribuidor</h2>

        <form className="nuevo-producto-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root && <p className="error-message">{errors.root.message}</p>}

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