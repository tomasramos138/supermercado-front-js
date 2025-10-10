import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useCategoria from "../../hooks/useCategoria";
import "./Categoria.css";

function NuevaCategoria() {
  const { categorias, isLoading, createCategoria, refetchCategorias, updateCategoria, deleteCategoria, isCreating = false, searchCategoriasByName } = useCategoria();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  // form para editar categoría en modal
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit }
  } = useForm();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCategorias, setDisplayedCategorias] = useState([]);

  useEffect(() => {
    setDisplayedCategorias(categorias || []);
  }, [categorias]);

  const handleRefetch = () => {
    setSearchTerm("");
    refetchCategorias?.();
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setDisplayedCategorias(categorias || []);
    } else {
      try {
        const result = await searchCategoriasByName(term);
        setDisplayedCategorias(result || []);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setDisplayedCategorias([]);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      await createCategoria({ 
        name: data.name, 
        description: data.description 
      });
      
      // Refetch para actualizar la lista de categorías Y limpiar twxtbox de la busqueda
      handleRefetch();
      
      reset();
    } catch (error) {
      console.error("Error al crear la categoría:", error);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar esta categoría?");
    if (!ok) return;
    try {
      setIsProcessingDelete(true);
      await deleteCategoria(id);
      handleRefetch();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    } finally {
      setIsProcessingDelete(false);
    }
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    resetEdit({ name: cat.name, description: cat.description });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingCategory(null);
    resetEdit();
  };

  const onEditSubmit = async (data) => {
    if (!editingCategory) return;
    try {
      setIsProcessingUpdate(true);
      await updateCategoria(editingCategory.id, { name: data.name, description: data.description });
      handleRefetch();
      closeEditModal();
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  if (isLoading) return <p>Cargando categorías...</p>;

  return (
    <div className="categorias-container">
      <h2 className="categorias-title">Categorías</h2>

      {/* Campo de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar categorías por nombre..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="categorias-list">
        {displayedCategorias?.map((cat) => (
          <div key={cat.id} className="categoria-card">
            <div className="categoria-actions">
              <button
                className="categoria-delete"
                onClick={() => handleDelete(cat.id)}
                disabled={isProcessingDelete}
                title="Eliminar categoría"
              >
                ✖
              </button>
              <button
                className="categoria-edit"
                onClick={() => openEditModal(cat)}
                title="Editar categoría"
              >
                ✎
              </button>
            </div>
            <div className="categoria-nombre">
              {cat.name}
            </div>
            <div className="categoria-descripcion">
              {cat.description}
            </div>
          </div>
        ))}
        {searchTerm && displayedCategorias.length === 0 && (
          <p>No se encontraron categorías</p>
        )}
      </div>

      {/* Modal de edición simple */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar categoría</h3>
            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="form-categoria">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nombre"
                  {...registerEdit("name", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" },
                    pattern: { value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, message: "Solo se permiten letras y espacios" }
                  })}
                />
                {errorsEdit?.name && <p className="error-message">{errorsEdit.name.message}</p>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Descripción"
                  {...registerEdit("description", {
                    minLength: { value: 5, message: "La descripción debe tener al menos 5 caracteres" }
                  })}
                />
                {errorsEdit?.description && <p className="error-message">{errorsEdit.description.message}</p>}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal}>Cancelar</button>
                <button type="submit" disabled={isProcessingUpdate || isSubmittingEdit}>{isProcessingUpdate ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="nueva-categoria">
        <h3 className="nueva-categoria-title">Nueva Categoría</h3>
        <form className="form-categoria" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres"
                },
                pattern: {
                  value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                  message: "Solo se permiten letras y espacios"
                }
              })}
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Descripción"
              {...register("description", {
                minLength: {
                  value: 5,
                  message: "La descripción debe tener al menos 5 caracteres"
                }
              })}
            />
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || isCreating}
          >
            {isSubmitting || isCreating ? "Creando..." : "Crear"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NuevaCategoria;