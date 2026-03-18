import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

// Crear una instancia personalizada de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor agrega el toke a cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Para manejar los errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o no válido
      localStorage.removeItem('token');
      console.error('Sesión expirada');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;