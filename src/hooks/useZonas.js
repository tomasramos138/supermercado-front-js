import { useQuery } from "@tanstack/react-query";
import { getZonas, searchZonasByName, createZona, updateZona, deleteZona } from "../services/api";

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
    createZona: async (zonaData) => (await createZona(zonaData)).data,
    updateZona: async (id, zonaData) => (await updateZona(id, zonaData)).data,
    deleteZona: async (id) => (await deleteZona(id)).data,
    searchZonasByName: async (q) => (await searchZonasByName(q)).data,
  };
}

export default useZonas;
