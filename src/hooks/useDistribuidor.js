import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig"; 
import { useAuth } from "../hooks/useAuth";

const getDistribuidoresByZona = async (zonaId) => {
  const response = await axiosInstance.get(`/api/distribuidor?zona=${zonaId}`);
  console.log("useDistribuidor: Datos recibidos:", response.data);
  return response.data.data;
};

const createDistribuidor = async (distribuidorData) => {
  try {
    const response = await axiosInstance.post("/api/distribuidor", distribuidorData);
    alert("Distribuidor creado correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al crear distribuidor:", error);
    alert("Error al crear el distribuidor");
    throw error;
  }
};

const deleteDistribuidor = async (distribuidorId) => {
  try {
    const response = await axiosInstance.delete(`/api/distribuidor/${distribuidorId}`);
    alert("Distribuidor eliminado correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al eliminar distribuidor:", error);
    alert("Error al eliminar el distribuidor");
    throw error;
  }
};

const updateDistribuidor = async (distribuidorId, distribuidorData) => {
  try {
    const response = await axiosInstance.put(`/api/distribuidor/${distribuidorId}`, distribuidorData);
    alert("Distribuidor actualizado correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar distribuidor:", error);
    alert("Error al actualizar el distribuidor");
    throw error;
  }
};

function useDistribuidor(zonaId) {
  const { token } = useAuth();

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId),
    enabled: !!zonaId && !!token,
  });

  return {
    distribuidores: data,
    isError,
    error,
    isLoading,
    refetchDistribuidores: refetch,
    createDistribuidor,
    deleteDistribuidor,
    updateDistribuidor,
  };
}

export default useDistribuidor;