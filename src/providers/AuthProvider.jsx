import { useState } from "react";
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
  const [user, setUser] = useState(getUser(localStorage.getItem("token")));//si no hay token, user es null (se valida en getUser que el token no esté expirado)
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);

  const isAuthenticated = () => {
    return !!getUser(localStorage.getItem('token'))
  }

  const login = async (userData) => {
    setErrorLogin(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        userData
      );
      localStorage.setItem("token", response.data.token);
      setUser(getUser(response.data.token));
      setWasAuthenticated(true);
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
    localStorage.removeItem("token");
    setWasAuthenticated(false); // El usuario ya no estará autenticado luego de cerrar sesión 
  };

  //funciones que van a ser usadas en cualquier componente que consuma el contexto
  const authValue = {
    isAuthenticated,
    user,
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