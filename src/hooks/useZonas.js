import { useQuery } from "@tanstack/react-query";
import {
  getZonas,
  searchZonasByName,
  createZona,
  updateZona,
  deleteZona
} from "../services/api";

function useZonas() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
  });

  const zonas = data?.data ?? [];

  return {
    zonas,
    isError,
    error,
    isLoading,
    refetchZonas: refetch,
    createZona: async (zonaData) => await createZona(zonaData),
    updateZona: async (id, zonaData) => await updateZona(id, zonaData),
    deleteZona: async (id) => await deleteZona(id),
    searchZonasByName: async (q) => await searchZonasByName(q),
  };
}

export default useZonas;
