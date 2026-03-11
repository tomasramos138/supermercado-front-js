import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export const API_URL = import.meta.env.VITE_API_URL

const getDistribuidoresByZona = async (zonaId, token) => {
  const response = await axios.get(`${API_URL}/api/distribuidor?zona=${zonaId}`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  console.log("useDistribuidor: Datos recibidos:", response.data);
  return response.data.data;
};

const createDistribuidor = async (distribuidorData, token) => { 
  const response = await axios.post(`${API_URL}/api/distribuidor`, distribuidorData, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  alert("Distribuidor creado correctamente");
  return response.data;
};

const deleteDistribuidor = async (distribuidorId, token) => { 
  const response = await axios.delete(`${API_URL}/api/distribuidor/${distribuidorId}`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  alert("Distribuidor eliminado correctamente");
  return response.data;
};

const updateDistribuidor = async (distribuidorId, distribuidorData, token) => { 
  const response = await axios.put(`${API_URL}/api/distribuidor/${distribuidorId}`, distribuidorData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  alert("Distribuidor actualizado correctamente");
  return response.data;
};

function useDistribuidor(zonaId) {
  const { token } = useAuth(); 

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId, token), 
    enabled: !!zonaId && !!token,
  });

  return {
    distribuidores: data,
    isError,
    error,
    isLoading,
    refetchDistribuidores: refetch,
    createDistribuidor: (distribuidorData) => createDistribuidor(distribuidorData, token),
    deleteDistribuidor: (distribuidorId) => deleteDistribuidor(distribuidorId, token),
    updateDistribuidor: (distribuidorId, distribuidorData) => updateDistribuidor(distribuidorId, distribuidorData, token),
  };
}

export default useDistribuidor;