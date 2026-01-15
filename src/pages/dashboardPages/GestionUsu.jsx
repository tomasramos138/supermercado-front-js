import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useClientes from "../../hooks/useCliente";
import "./GestionUsu.css";

function GestionUsu() {
  const { searchClientesByName, updateClient } = useClientes();
  const { register, watch } = useForm();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = watch("searchTerm");

  useEffect(() => {
    const searchClientes = async () => {
      if (!searchTerm || !searchTerm.trim()) {
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
      }
    };

    const timeoutId = setTimeout(searchClientes, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchClientesByName]);

  const handleToggleAdmin = async (id, currentRole) => {
    try {
      // Cambiar entre 'admin' y 'usuario'
      const newRole = currentRole === 'admin' ? 'usuario' : 'admin';
      await updateClient({ id, rol: newRole });
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, rol: newRole } : c))
      );
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol");
    }
  };

  // O si quieres un selector más completo con múltiples roles:
  const handleRoleChange = async (id, newRole) => {
    try {
      await updateClient({ id, rol: newRole });
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, rol: newRole } : c))
      );
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol");
    }
  };

  // Función para traducir el rol a texto legible
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'usuario':
        return 'Usuario';
      case 'empleado':
        return 'Empleado';
      default:
        return role || 'Usuario';
    }
  };

  return (
    <div className="gestion-page">
      <div className="register-header">
        <h1>Gestión de Usuarios</h1>
        <p>Busque un cliente para editar su rol</p>
      </div>

      <form className="register-form" noValidate>
        <div className="form-group">
          <label htmlFor="searchTerm">Buscar cliente</label>
          <input
            id="searchTerm"
            type="text"
            className="form-input"
            placeholder="Ingrese nombre del cliente"
            {...register("searchTerm")}
          />
        </div>

        {loading && (
          <div className="loading-indicator">Buscando...</div>
        )}
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
                <th>Rol Actual</th>
                <th>Cambiar Rol</th>
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
                    <span className={`role-badge role-${cliente.rol || 'usuario'}`}>
                      {getRoleLabel(cliente.rol)}
                    </span>
                  </td>
                  <td>
                    {/* Opción 1: Switch simple admin/usuario */}
                    <div className="role-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={cliente.rol === 'admin'}
                          onChange={() => handleToggleAdmin(cliente.id, cliente.rol)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="toggle-label">
                        {cliente.rol === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
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
              : searchTerm && searchTerm.trim()
              ? "No se encontraron clientes"
              : "Usa el campo de búsqueda para encontrar clientes."}
          </p>
        )}
      </div>
    </div>
  );
}

export default GestionUsu;