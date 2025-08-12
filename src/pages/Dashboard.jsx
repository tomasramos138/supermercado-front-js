import { useAuth } from "../hooks/useAuth";
import useClientesCount from "../hooks/useCliente";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { clientesCount, isLoading, isError } = useClientesCount();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Panel de control</h1>
        <p>Bienvenido nuevamente, {user?.name || "User"}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total usuarios</h3>
            {isLoading ? (
              <p className="stat-number">Cargando...</p>
            ) : isError ? (
              <p className="stat-number">Error</p>
            ) : (
              <p className="stat-number">{clientesCount}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;