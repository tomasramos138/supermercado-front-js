import { useQuery } from "@tanstack/react-query";
import { 
  getZonas,
  searchZonasByName,
  createZona,
  deleteZona,
  updateZona
} from "../services/api";

function useZonas() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["zonas"],
    queryFn: async () => {
      const res = await getZonas();
      return res.data.data;
    },
  });

  const createZonaFn = async (zonaData) => {
    try {
      const res = await createZona(zonaData);
      alert("Zona creada correctamente");
      return res.data;
    } catch (err) {
      console.error("Error al crear la zona:", err);
      throw err;
    }
  };

  const updateZonaFn = async (id, zonaData) => {
    try {
      const res = await updateZona(id, zonaData);
      alert("Zona actualizada correctamente");
      return res.data;
    } catch (err) {
      console.error("Error al actualizar la zona:", err);
      throw err;
    }
  };

  const deleteZonaFn = async (id) => {
    try {
      const res = await deleteZona(id);
      alert("Zona eliminada correctamente");
      return res.data;
    } catch (err) {
      console.error("Error al eliminar la zona:", err);
      throw err;
    }
  };

  const searchZonasByNameFn = async (param) => {
    const res = await searchZonasByName(param);
    return res.data.data;
  };

  return {
    zonas: data,
    isError,
    error,
    isLoading,
    refetchZonas: refetch,
    createZona: createZonaFn,
    updateZona: updateZonaFn,
    deleteZona: deleteZonaFn,
    searchZonasByName: searchZonasByNameFn,
  };
}

export default useZonas;
