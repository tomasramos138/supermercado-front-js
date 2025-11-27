import { useQuery } from "@tanstack/react-query";
import { getClientesCount, updateClient, searchClientesByName } from "../services/api";

function useClientes() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: getClientesCount,
  });

  // ✔️ EXTRAER SOLO EL NUMERO
  const clientesCount = data?.data ?? 0;

  const updateClientFn = async ({ id, ...clientData }) => {
    const res = await updateClient(id, clientData);
    alert("Cliente modificado correctamente");
    return res;
  };

  const searchClientesByNameFn = (param) => searchClientesByName(param);

  return {
    clientesCount,
    isError,
    error,
    isLoading,
    refetchClientesCount: refetch,
    updateClient: updateClientFn,
    searchClientesByName: searchClientesByNameFn,
  };
}

export default useClientes;
