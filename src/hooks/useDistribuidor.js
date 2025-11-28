import { useQuery } from "@tanstack/react-query";
import {
  getDistribuidoresByZona,
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor
} from "../services/api";

function useDistribuidores(zonaId) {

  const {
    data: distData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId),
    enabled: !!zonaId, // evita ejecutar si zonaId no existe
  });

  const distribuidores = Array.isArray(distData)
    ? distData
    : Array.isArray(distData?.data)
      ? distData.data
      : [];

  return {
    distribuidores,
    isLoading,
    isError,
    error,
    refetch,
    createDistribuidor,
    updateDistribuidor,
    deleteDistribuidor
  };
}

export default useDistribuidores;
