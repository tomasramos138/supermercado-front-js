import { useState } from "react";
import useClientes from "../../hooks/useCliente";
import './GestionUsu.css'; // Asegúrate de que este archivo contiene el CSS que te pasé antes.

function GestionUsu() {
  const { searchClientesByName, updateClient } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setClientes([]); // Limpiar resultados si la búsqueda está vacía
      return;
    }
    setLoading(true);
    try {
      const results = await searchClientesByName(searchTerm);
      setClientes(results);
    } catch (error) {
      console.error("Error buscando clientes:", error);
      // Opcional: Mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (id, currentRole) => {
    try {
      const newRole = !currentRole; // cambia true/false
      await updateClient({ id, rol: newRole });
      setClientes(prev =>
        prev.map(c => c.id === id ? { ...c, rol: newRole } : c)
      );
    } catch (error) {
      console.error("Error actualizando rol:", error);
      // Opcional: Revertir el estado o mostrar un error
    }
  };

  return (
    // Aplicamos la clase principal
    <div className="gestion-page">
      <div className="gestion-header">
        <h2>Gestión de Clientes/Usuarios</h2>
      </div>

      {/* Aplicamos la clase de la barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Permite buscar al presionar Enter
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar Clientes"}
        </button>
      </div>

      {/* Contenedor de la tabla con la clase flotante */}
      <div className="clientes-table-container">
        {clientes.length > 0 ? (
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Rol (Admin)</th> {/* Cambiamos el texto para que quede mejor con el switch */}
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
                    {/* Aplicamos la clase role-checkbox para el switch */}
                    <div className="role-checkbox">
                      <input
                        type="checkbox"
                        id={`rol-switch-${cliente.id}`} // Necesario para el label
                        checked={cliente.rol} // true = admin
                        onChange={() => handleToggleAdmin(cliente.id, cliente.rol)}
                      />
                      {/* El label es el elemento visible que se estiliza como switch */}
                      <label htmlFor={`rol-switch-${cliente.id}`}></label>
                      <span>{cliente.rol ? 'Admin' : 'Cliente'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Mensaje si no hay resultados, usando la clase moderna
          <p className="no-clientes">
            {loading ? "Cargando..." : "Usa la barra de búsqueda para encontrar clientes."}
          </p>
        )}
      </div>
    </div>
  );
}

export default GestionUsu;
