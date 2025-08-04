import { useState } from 'react';
import { AuthContext } from '../contexts/auth';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

const login = async (token, cliente) => {
  localStorage.setItem("token", token);//guarda el token para que el usuario no tenga que iniciar sesión cada vez que recarga la página
  localStorage.setItem('usuario', JSON.stringify(cliente));// guarda el usuario para que se pueda acceder a sus datos en otras partes de la aplicación
  setIsAuthenticated(true);
  setUser(cliente);
  setWasAuthenticated(true);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUser(null);
  };

  const authValue = {
    isAuthenticated,
    user,
    login,
    logout,
    wasAuthenticated
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}; 