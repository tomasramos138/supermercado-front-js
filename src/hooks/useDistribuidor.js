import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL

const getDistribuidoresByZona = async (zonaId) => {
  const response = await axios.get(`${API_URL}/api/distribuidor?zona=${zonaId}`);
  console.log("useDistribuidor: Datos recibidos:", response.data);
  return response.data.data;
};

const createDistribuidor = async (distribuidorData) => {
  const response = await axios.post(`${API_URL}/api/distribuidor`, distribuidorData);
  return response.data;
};

const deleteDistribuidor = async (distribuidorId) => {
  const response = await axios.delete(`${API_URL}/api/distribuidor/${distribuidorId}`);
  return response.data;
} 

const updateDistribuidor = async (distribuidorId, distribuidorData) => {
  const response = await axios.put(`${API_URL}/api/distribuidor/${distribuidorId}`, distribuidorData);
  return response.data;
}

function useDistribuidor(zonaId) {

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId),
    enabled: !!zonaId, 
  });

  return {
    distribuidores: data,
    isError,
    error,
    isLoading,
    createDistribuidor,
    deleteDistribuidor, 
    refetchDistribuidores: refetch,
    updateDistribuidor
  };
}

export default useDistribuidor;
