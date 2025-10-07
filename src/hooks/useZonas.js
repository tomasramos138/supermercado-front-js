import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getZonas = async () => {
  const response = await axios.get("http://localhost:3000/api/zona");
  //console.log("useZonas: Datos recibidos:", response.data);
  return response.data.data  
};

const createZona = async (zonaData) => {
  const response = await axios.post("http://localhost:3000/api/zona", zonaData);
  return response.data;
};

function useZonas() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
  });

  return {
    zonas: data,
    isError,
    error,
    isLoading,
    createZona,
  };
}

export default useZonas;