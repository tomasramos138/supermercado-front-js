import { useAuth } from "../hooks/useAuth";
import useClientesCount from "../hooks/useCliente";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import useVentasCount from "../hooks/useVenta";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    clientesCount,
    isLoading: isClientesLoading,
    isError: isClientesError,
  } = useClientesCount();
  const {
    ventasCount,
    isLoading: isVentasLoading,
    isError: isVentasError,
  } = useVentasCount();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Panel de control</h1>
        <p>Bienvenido nuevamente, {user?.name || "User"}!</p>
      </div>

      <div className="dashboard-grid">
        {/* Sección de Métricas Rápidas */}
        <div className="metrics-section">
          <h2 className="section-title">Resumen General</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <h3>Clientes</h3>
                {isClientesLoading ? (
                  <p className="metric-value">Cargando...</p>
                ) : isClientesError ? (
                  <p className="metric-value">Error</p>
                ) : (
                  <p className="metric-value">{clientesCount}</p>
                )}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📦</div>
              <div className="metric-content">
                <h3>Stock Total</h3>
                <p className="metric-value">1,248</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>Cantidad de Ventas</h3>
                {isVentasLoading ? (
                  <p className="metric-value">Cargando...</p>
                ) : isVentasError ? (
                  <p className="metric-value">Error</p>
                ) : (
                  <p className="metric-value">{ventasCount}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Acciones Rápidas */}
        <div className="quick-actions-section">
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="actions-grid">
            <Link to="/zonas-distribuidores/nuevo" className="action-card">
              <span className="action-icon">🗺️</span>
              <span className="action-label">Nueva Zona-Distribuidor</span>
            </Link>

            <Link to="/productos/nuevo" className="action-card">
              <span className="action-icon">🛍️</span>
              <span className="action-label">Nuevo Producto</span>
            </Link>

            <Link to="/stock/ajuste" className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-label">Ajustar Stock</span>
            </Link>
            <Link to="/categorias/nueva" className="action-card">
              <span className="action-icon">🏷️</span>
              <span className="action-label">Nueva Categoría</span>
            </Link>
          </div>
        </div>

        {/* Sección de Módulos Principales */}
        <div className="modules-section">
          <h2 className="section-title">Módulos Principales</h2>
          <div className="modules-grid">
            <Link to="/ventas" className="module-card">
              <span className="action-icon">💰</span>
              <div className="module-content">
                <h3>Reporte de Ventas</h3>
                <p>Analiza y filtra tus ventas</p>
              </div>
            </Link>

            <Link to="/clientes" className="module-card">
              <div className="action-icon">👥</div>
              <div className="module-content">
                <h3>Gestion de Usuarios</h3>
                <p>Administra tu base de usuarios</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;