import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getZonas = async () => {
  const response = await axios.get("http://localhost:3000/api/zona");
  return response.data.data  
};

const searchZonasByName = async (param) => {
  const response = await axios.get("http://localhost:3000/api/zona/search", {
    params: { q: param },
  });
  return response.data.data;
};

const createZona = async (zonaData) => {
  const response = await axios.post("http://localhost:3000/api/zona", zonaData);
  return response.data;
};

const deleteZona = async (zonaId) => {
  const response = await axios.delete(`http://localhost:3000/api/zona/${zonaId}`);
  return response.data;
}

const updateZona = async (zonaId, zonaData) => {
  const response = await axios.put(`http://localhost:3000/api/zona/${zonaId}`, zonaData);
  return response.data;
} 

function useZonas() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
  });

  return {
    zonas: data,
    isError,
    error,
    isLoading,
    createZona,
    deleteZona,
    refetchZonas: refetch,
    updateZona,
    searchZonasByName,
  };
}

export default useZonas;   