import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig"; 
import { useAuth } from "../hooks/useAuth";

const getZonas = async () => {
  const response = await axiosInstance.get("/api/zona");
  return response.data.data;
};

const searchZonasByName = async (param) => {
  const response = await axiosInstance.get("/api/zona/search", {
    params: { q: param },
  });
  return response.data.data;
};

const createZona = async (zonaData) => {
  try {
    const response = await axiosInstance.post("/api/zona", zonaData);
    alert("Zona creada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al crear zona:", error);
    alert("Error al crear la zona");
    throw error;
  }
};

const deleteZona = async (zonaId) => {
  try {
    const response = await axiosInstance.delete(`/api/zona/${zonaId}`);
    alert("Zona eliminada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al eliminar zona:", error);
    alert("Error al eliminar la zona");
    throw error;
  }
};

const updateZona = async (zonaId, zonaData) => {
  try {
    const response = await axiosInstance.put(`/api/zona/${zonaId}`, zonaData);
    alert("Zona actualizada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar zona:", error);
    alert("Error al actualizar la zona");
    throw error;
  }
};

function useZonas() {

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas
  });

  return {
    zonas: data,
    isError,
    error,
    isLoading,
    refetchZonas: refetch,
    createZona,
    deleteZona,
    updateZona,
    searchZonasByName,
  };
}

export default useZonas;