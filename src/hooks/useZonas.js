import { useQuery } from "@tanstack/react-query";
import {
  getZonas,
  searchZonasByName,
  createZona,
  deleteZona,
  updateZona
} from "../services/api";

function useZonas() {
  const {
    data: zonasData,
    isError,
    error,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
  });

  // backend: { message, data: [] }
  const zonas = Array.isArray(zonasData) 
    ? zonasData
    : Array.isArray(zonasData?.data)
      ? zonasData.data
      : [];

  const createZonaFn = async (zona) => createZona(zona);
  const deleteZonaFn = async (id) => deleteZona(id);
  const updateZonaFn = async (id, zona) => updateZona(id, zona);

  const safeSearchZonas = async (term) => {
    if (!term) return [];
    const res = await searchZonasByName(term);
    return Array.isArray(res) ? res : [];
  };

  return {
    zonas,
    isError,
    error,
    isLoading,
    refetch,
    createZona: createZonaFn,
    deleteZona: deleteZonaFn,
    updateZona: updateZonaFn,
    searchZonasByName: safeSearchZonas,
  };
}

export default useZonas;
