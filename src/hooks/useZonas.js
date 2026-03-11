import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth"; 

export const API_URL = import.meta.env.VITE_API_URL

const getZonas = async (token) => {
  const response = await axios.get(`${API_URL}/api/zona`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  return response.data.data;
};

const searchZonasByName = async (param, token) => {
  const response = await axios.get(`${API_URL}/api/zona/search`, {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { q: param },
  });
  return response.data.data;
};

const createZona = async (zonaData, token) => {
  const response = await axios.post(`${API_URL}/api/zona`, zonaData, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  alert("Zona creada correctamente");
  return response.data;
};

const deleteZona = async (zonaId, token) => {
  const response = await axios.delete(`${API_URL}/api/zona/${zonaId}`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  alert("Zona eliminada correctamente");
  return response.data;
};

const updateZona = async (zonaId, zonaData, token) => {
  const response = await axios.put(`${API_URL}/api/zona/${zonaId}`, zonaData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  alert("Zona actualizada correctamente");
  return response.data;
};

function useZonas() {
  const { token } = useAuth();

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["zonas"],
    queryFn: () => getZonas(token), 
    enabled: !!token, 
  });

  return {
    zonas: data,
    isError,
    error,
    isLoading,
    refetchZonas: refetch,
    createZona: (zonaData) => createZona(zonaData, token),
    deleteZona: (zonaId) => deleteZona(zonaId, token),
    updateZona: (zonaId, zonaData) => updateZona(zonaId, zonaData, token),
    searchZonasByName: (param) => searchZonasByName(param, token),
  };
}

export default useZonas;