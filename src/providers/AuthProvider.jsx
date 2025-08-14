import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function isExpired(expiration) {
  return Date.now() / 1000 > expiration;
}

function getUser(jwt) {
  try {
    const decoded = jwtDecode(jwt);
    
    if (isExpired(decoded.exp)) {
      return null;
    }

    return {
      id: decoded.id,
      usuario: decoded.usuario,
      name: decoded.name,
      apellido: decoded.apellido,
      rol: decoded.rol,
      zona: decoded.zona,
    };
  } catch (error) {
    return null;
  }
}



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser(localStorage.getItem("token")));
  const [distribuidor, setDistribuidor] = useState(null);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);

  // Función para obtener el distribuidor por zona
  const fetchDistribuidor = async (zonaId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/distribuidor/zona/${zonaId}`);
      return response.data.data[0]; // Asumiendo que devuelve un array y queremos el primero
    } catch (error) {
      console.error("Error al obtener distribuidor:", error);
      return null;
    }
  };

  // Efecto para cargar el distribuidor cuando el usuario cambia
  useEffect(() => {
    const loadDistribuidor = async () => {
      if (user?.zona) {
        const distribuidorData = await fetchDistribuidor(user.zona.id);
        setDistribuidor(distribuidorData);
      }
    };
    
    loadDistribuidor();
  }, [user]);

  const isAuthenticated = () => {
    return !!getUser(localStorage.getItem('token'));
  }

  const login = async (userData) => {
    setErrorLogin(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        userData
      );
      localStorage.setItem("token", response.data.token);
      const user = getUser(response.data.token);
      setUser(user);
      setWasAuthenticated(true);
      
      // Cargar distribuidor después de login
      if (user?.zona) {
        const distribuidorData = await fetchDistribuidor(user.zona);
        setDistribuidor(distribuidorData);
      }
    } catch (error) {
      console.log("error", error);
      setErrorLogin(error.response.data.message || "Error al iniciar sesión");
    }
  };

  const registerUser = async (userData) => {
    setErrorLogin(null);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      const message = error.response?.data?.message || "Error al registrar usuario";
      setErrorLogin(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setDistribuidor(null);
    localStorage.removeItem("token");
    setWasAuthenticated(false);
  };

// ermite que las funciones puedan ser utilizadas en otras componentes del contexto
  const authValue = {
    isAuthenticated,
    user,
    distribuidor, 
    login,
    registerUser,
    logout,
    wasAuthenticated,
    errorLogin,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};