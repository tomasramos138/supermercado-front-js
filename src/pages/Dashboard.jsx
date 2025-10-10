import { useAuth } from "../hooks/useAuth";
import useClientesCount from "../hooks/useCliente";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import useVentasCount from "../hooks/useVenta";
import useProducts from "../hooks/useProducts";

const Dashboard = () => {
  const { user } = useAuth();
  const {clientesCount, isLoading: isClientesLoading, isError: isClientesError,} = useClientesCount();
  const {ventasCount, isLoading: isVentasLoading, isError: isVentasError, } = useVentasCount();
  const {totalStock, isStockLoading, isStockError} = useProducts();

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
                  <div className="spinner"></div>
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
                {isStockLoading ? (
                  <div className="spinner"></div>
                ) : isStockError ? (
                  <p className="metric-value">Error</p>
                ) : (
                  <p className="metric-value">{totalStock?.toLocaleString()}</p>
                )}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>Cantidad de Ventas</h3>
                {isVentasLoading ? (
                  <div className="spinner"></div>
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
            <Link to="/products/zonas-distribuidores" className="action-card">
              <span className="action-icon">🗺️</span>
              <span className="action-label">Nueva Zona-Distribuidor</span>
            </Link>

            <Link to="/products/NuevosProductos" className="action-card">
              <span className="action-icon">🛍️</span>
              <span className="action-label">Nuevo Producto</span>
            </Link>

            <Link to="/products/GestionProductos" className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-label">Gestion productos</span>
            </Link>
            <Link to="/products/Categoria" className="action-card">
              <span className="action-icon">🏷️</span>
              <span className="action-label">Categoría</span>
            </Link>
          </div>
        </div>

        {/* Sección de Módulos Principales */}
        <div className="modules-section">
          <h2 className="section-title">Módulos Principales</h2>
          <div className="modules-grid">
            <Link to="/products/ventas" className="module-card">
              <span className="action-icon">💰</span>
              <div className="module-content">
                <h3>Reporte de Ventas</h3>
                <p>Analiza y filtra tus ventas</p>
              </div>
            </Link>

            <Link to="/products/GestionUsu" className="module-card">
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
export default Dashboard
