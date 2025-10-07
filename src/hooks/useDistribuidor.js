import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getDistribuidoresByZona = async (zonaId) => {
  const response = await axios.get(`http://localhost:3000/api/distribuidor?zona=${zonaId}`);
  console.log("useDistribuidor: Datos recibidos:", response.data);
  return response.data.data;
};

const createDistribuidor = async (distribuidorData) => {
  const response = await axios.post("http://localhost:3000/api/distribuidor", distribuidorData);
  return response.data;
};

function useDistribuidor(zonaId) {

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId),
    enabled: !!zonaId, // Solo ejecuta la consulta si zonaId tiene valor
  });

  return {
    distribuidores: data,
    isError,
    error,
    isLoading,
    createDistribuidor,
  };
}

export default useDistribuidor;