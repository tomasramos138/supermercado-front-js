import { useQuery } from "@tanstack/react-query";
import { 
  getDistribuidoresByZona,
  createDistribuidor,
  deleteDistribuidor,
  updateDistribuidor
} from "../services/api";

function useDistribuidor(zonaId) {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: async () => {
      const res = await getDistribuidoresByZona(zonaId);
      return res.data.data;
    },
    enabled: !!zonaId, // solo se ejecuta si zonaId tiene valor
  });

  const createDistribuidorFn = async (distribuidorData) => {
    try {
      const res = await createDistribuidor(distribuidorData);
      alert("Distribuidor creado correctamente");
      return res.data;
    } catch (err) {
      console.error("Error al crear el distribuidor:", err);
      throw err;
    }
  };

  const updateDistribuidorFn = async (id, distribuidorData) => {
    try {
      const res = await updateDistribuidor(id, distribuidorData);
      alert("Distribuidor actualizado correctamente");
      return res.data;
    } catch (err) {
      console.error("Error al actualizar el distribuidor:", err);
      throw err;
    }
  };

  const deleteDistribuidorFn = async (id) => {
    try {
      const res = await deleteDistribuidor(id);
      alert("Distribuidor eliminado correctamente");
      return res.data;
    } catch (err) {
      console.error("Error al eliminar el distribuidor:", err);
      throw err;
    }
  };

  return {
    distribuidores: data,
    isError,
    error,
    isLoading,
    refetchDistribuidores: refetch,
    createDistribuidor: createDistribuidorFn,
    updateDistribuidor: updateDistribuidorFn,
    deleteDistribuidor: deleteDistribuidorFn,
  };
}

export default useDistribuidor;
