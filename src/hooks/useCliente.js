import { useQuery } from "@tanstack/react-query";
import { getClientesCount, updateClient, searchClientesByName, getClientesCount } from "../services/api";

function useClientes() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: () => getClientesCount().then(res => res.data.data),
  });

  const updateClientFn= ({ id, ...clientData }) => {
    return updateClient(id, clientData)
      .then(res => {
        alert("Cliente modificado correctamente");
        return res.data;
      })
      .catch(err => {
        console.error("Error al modificar el cliente:", err);
        throw err;
      });
  };

  const searchClientesByNameFn = (param) => {
    return searchClientesByName(param).then(res => res.data.data);
  };

  return {
    clientesCount: data,
    isError,
    error,
    isLoading,
    refetchClientesCount: refetch,
    updateClient: updateClientFn,
    searchClientesByName: searchClientesByNameFn,
  };
}

export default useClientes;
