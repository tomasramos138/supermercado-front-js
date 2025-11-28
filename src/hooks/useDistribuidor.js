import { useQuery } from "@tanstack/react-query";
import {
  getDistribuidoresByZona,
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor
} from "../services/api";

function useDistribuidores(zonaId) {

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId),
    enabled: Boolean(zonaId), // solo corre si zonaId existe
  });

  // Normalización del resultado
  const distribuidores = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return {
    distribuidores,
    isLoading,
    isError,
    error,
    refetch,

    // Mutaciones directas desde la API
    createDistribuidor,
    updateDistribuidor,
    deleteDistribuidor
  };
}

export default useDistribuidores;
