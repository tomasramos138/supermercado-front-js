import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL

const getZonas = async () => {
  const response = await axios.get(`${API_URL}/api/zona`);
  return response.data.data  
};

const searchZonasByName = async (param) => {
  const response = await axios.get(`${API_URL}/api/zona/search`, {
    params: { q: param },
  });
  return response.data.data;
};

const createZona = async (zonaData) => {
  const response = await axios.post(`${API_URL}/api/zona`, zonaData);
  return response.data;
};

const deleteZona = async (zonaId) => {
  const response = await axios.delete(`${API_URL}/api/zona/${zonaId}`);
  return response.data;
}

const updateZona = async (zonaId, zonaData) => {
  const response = await axios.put(`${API_URL}/api/zona/${zonaId}`, zonaData);
  return response.data;
} 

function useZonas() {
  const { data, isError, error, isLoading, refetch: refetchZonas } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
  });

  // backend: { message, data: [] }
  const zonas = Array.isArray(zonasData) 
    ? zonasData
    : Array.isArray(zonasData?.data)
      ? zonasData.data
      : [];

  const createZonaFn = async (zona) => createZona(zona);
  const deleteZonaFn = async (id) => deleteZona(id);
  const updateZonaFn = async (id, zona) => {
    if (!id) throw new Error("ID inválido");
    return updateZona(id, zona);
  };
  

  const safeSearchZonas = async (term) => {
    if (!term) return [];
    const res = await searchZonasByName(term);
    return Array.isArray(res) ? res : [];
  };

  return {
    zonas,
    isError,
    error,
    isLoading,
    createZona,
    deleteZona,
    refetchZonas,
    updateZona,
    searchZonasByName,
  };
}

export default useZonas;
