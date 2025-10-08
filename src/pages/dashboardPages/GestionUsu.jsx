import { useState } from "react";
import { useForm } from "react-hook-form";
import useClientes from "../../hooks/useCliente";
import "./GestionUsu.css";

function GestionUsu() {
  const { searchClientesByName, updateClient } = useClientes();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async (data) => {
    const { searchTerm } = data;
    if (!searchTerm.trim()) {
      setClientes([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchClientesByName(searchTerm);
      setClientes(results);
    } catch (error) {
      console.error("Error buscando clientes:", error);
      alert("Error al buscar clientes");
    } finally {
      setLoading(false);
      reset();
    }
  };

  const handleToggleAdmin = async (id, currentRole) => {
    try {
      const newRole = !currentRole;
      await updateClient({ id, rol: newRole });
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, rol: newRole } : c))
      );
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol");
    }
  };

  return (
    <div className="gestion-page">
      <div className="register-header">
        <h1>Gestión de Usuarios</h1>
        <p>Busque un cliente para editar su rol</p>
      </div>

      <form
        className="register-form"
        onSubmit={handleSubmit(onSearch)}
        noValidate
      >
        <div className="form-group">
          <label htmlFor="searchTerm">Buscar cliente</label>
          <input
            id="searchTerm"
            type="text"
            className="form-input"
            placeholder="Ingrese nombre del cliente"
            {...register("searchTerm", {
              required: "Debe ingresar un nombre para buscar",
            })}
          />
          {errors.searchTerm && (
            <div className="error-message">{errors.searchTerm.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="register-btn"
          disabled={isSubmitting || loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <div className="clientes-table-container">
        {clientes.length > 0 ? (
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.name}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.dni}</td>
                  <td>
                    <div className="role-checkbox">
                      <input
                        type="checkbox"
                        id={`rol-switch-${cliente.id}`}
                        checked={cliente.rol}
                        onChange={() =>
                          handleToggleAdmin(cliente.id, cliente.rol)
                        }
                      />
                      <label htmlFor={`rol-switch-${cliente.id}`}></label>
                      <span>{cliente.rol ? "Admin" : "Cliente"}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-clientes">
            {loading
              ? "Cargando..."
              : "Usa el campo de búsqueda para encontrar clientes."}
          </p>
        )}
      </div>
    </div>
  );
}

export default GestionUsu;