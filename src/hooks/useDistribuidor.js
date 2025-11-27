import { useQuery } from "@tanstack/react-query";
import { getDistribuidoresByZona, createDistribuidor, updateDistribuidor, deleteDistribuidor } from "../services/api";

function useDistribuidor(zonaId) {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["distribuidores", zonaId],
    queryFn: () => getDistribuidoresByZona(zonaId),
    enabled: !!zonaId,
  });

  const distribuidores = data?.data ?? [];

  const createDistribuidorFn = async (distribuidorData) => {
    try {
      const res = await createDistribuidor(distribuidorData);
      return res.data;
    } catch (err) {
      console.error("Error al crear distribuidor:", err);
      throw err;
    }
  };

  const updateDistribuidorFn = async (id, distribuidorData) => {
    try {
      const res = await updateDistribuidor(id, distribuidorData);
      return res.data;
    } catch (err) {
      console.error("Error al actualizar distribuidor:", err);
      throw err;
    }
  };

  const deleteDistribuidorFn = async (id) => {
    try {
      const res = await deleteDistribuidor(id);
      return res.data;
    } catch (err) {
      console.error("Error al eliminar distribuidor:", err);
      throw err;
    }
  };

  return {
    distribuidores,
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
