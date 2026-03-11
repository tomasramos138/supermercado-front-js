import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export const API_URL = import.meta.env.VITE_API_URL

const getCategoria = async (token) => {
  const response = await axios.get(`${API_URL}/api/categoria`,{
        headers: {
      'Authorization': `Bearer ${token}` 
    }
  });
  return response.data.data;
 };

const searchCategoriasByName = async (param, token) => {
  const response = await axios.get(`${API_URL}/api/categoria/search`, {
    headers: {
      'Authorization': `Bearer ${token}` 
    },
    params: { q: param },
  });
  return response.data.data;
};

const createCategoria = async (categoriaData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/categoria`, categoriaData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert("Categoría creada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    alert("Error al crear la categoría ");
    throw error;
  }
};

const deleteCategoria = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/categoria/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert("Categoría eliminada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    alert("Error al eliminar la categoría");
    throw error;
  }
};
 
const updateCategoria = async (id, categoriaData, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/categoria/${id}`, categoriaData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert("Categoría actualizada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    alert("Error al actualizar la categoría");
    throw error;
  }
};
 
 function useCategoria() {
  const { token } = useAuth();
  const getToken = () => localStorage.getItem('token');
  console.log('Token enviado:', token);
  console.log('Token length:', token?.length);
  
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getCategoria(token), 
    enabled: !!token, // Solo ejecuta si hay token
  });

  return {
    categorias: data,
    isError,
    error,
    isLoading,
    //Se pasa el token en cada función
    createCategoria: (data) => createCategoria(data, token),
    deleteCategoria: (id) => deleteCategoria(id, token),
    updateCategoria: (id, data) => updateCategoria(id, data, token),
    searchCategoriasByName: (param) => searchCategoriasByName(param, token),
    refetchCategorias: refetch,
  };
}

export default useCategoria;