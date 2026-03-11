import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth"; 

export const API_URL = import.meta.env.VITE_API_URL

const getClientesCount = async (token) => {
  const response = await axios.get(`${API_URL}/api/cliente/count`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  return response.data.data;
};

const updateClient = async ({ id, ...clientData }, token) => { 
  try {
    const response = await axios.patch(`${API_URL}/api/cliente/${id}`, clientData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    alert('Cliente modificado correctamente');
    return response.data;
  } catch (error) {
    console.error('Error al modificar el cliente:', error);
    throw error;
  }
};

const searchClientesByName = async (param, token) => { 
  const response = await axios.get(`${API_URL}/api/cliente/search`, {
    headers: { 'Authorization': `Bearer ${token}` }, 
    params: { q: param },
  });
  return response.data.data;
};

function useClientes() {
  const { token } = useAuth();

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: () => getClientesCount(token),
    enabled: !!token, // Solo ejecuta si hay token
  });
  
  return {
    clientesCount: data,
    isError,
    error,
    isLoading,
    refetchClientesCount: refetch, 
    updateClient: (data) => updateClient(data, token),
    searchClientesByName: (param) => searchClientesByName(param, token),
  };
}

export default useClientes;