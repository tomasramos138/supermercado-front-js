import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AuthLayout.css';

const AuthLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-layout">
      <aside className="auth-sidebar">
        <div className="sidebar-header">
          <h2>Supermercado</h2>
          <p>Bienvenido, {user?.name || 'User'}!</p>
        </div>

        <nav className="sidebar-nav">

          <Link to="/products" className="sidebar-link">
            <span className="icon">🧴</span>
            Productos
          </Link>

          {user?.rol === true && (
            <Link to="/products/dashboard" className="sidebar-link">
              <span className="icon">📊</span>
              Panel de Control
            </Link>
          )}

          <Link to="/products/carrito" className="sidebar-link">
            <span className="icon">🛒</span>
            Carrito
          </Link>
          
          <Link to="/products/profile" className="sidebar-link">
            <span className="icon">👤</span>
            Perfil
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="auth-content">
        <header className="auth-header">
          <h1>Area Protegida</h1>
        </header>

        <div className="auth-main">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;