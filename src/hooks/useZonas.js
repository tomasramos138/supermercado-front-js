import { useQuery } from "@tanstack/react-query";
import { getZonas, createZona, updateZona, deleteZona, searchZonasByName } from "../services/api";

function useZonas() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["zonas"],
    queryFn: getZonas,
  });

  const zonas = data?.data ?? [];

  const createZonaFn = async (zonaData) => {
    try {
      const res = await createZona(zonaData);
      return res;
    } catch (err) {
      console.error("Error al crear zona:", err);
      throw err;
    }
  };

  const updateZonaFn = async (id, zonaData) => {
    try {
      const res = await updateZona(id, zonaData);
      return res;
    } catch (err) {
      console.error("Error al actualizar zona:", err);
      throw err;
    }
  };

  const deleteZonaFn = async (id) => {
    try {
      const res = await deleteZona(id);
      return res;
    } catch (err) {
      console.error("Error al eliminar zona:", err);
      throw err;
    }
  };

  const searchZonasFn = async (name) => {
    try {
      const res = await searchZonasByName(name);
      return res.data;
    } catch (err) {
      console.error("Error al buscar zonas:", err);
      throw err;
    }
  };

  return {
    zonas,
    isError,
    error,
    isLoading,
    refetchZonas: refetch,
    createZona: createZonaFn,
    updateZona: updateZonaFn,
    deleteZona: deleteZonaFn,
    searchZonasByName: searchZonasFn,
  };
}

export default useZonas;
