import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL

const getClientesCount = async () => {
  const response = await axios.get(`${API_URL}/api/cliente/count`);
  return response.data.data;
};

const updateClient = async ({ id, ...clientData }) => {
  try {
    const response = await axios.patch(`${API_URL}/api/cliente/${id}`, clientData);
    alert('Cliente modificado correctamente');
    return response.data;
  } catch (error) {
    console.error('Error al modificar el cliente:', error);
    throw error;
  }
};

const searchClientesByName = async (param) => {
  const response = await axios.get(`${API_URL}/api/cliente/search`, {
    params: { q: param },
  });
  return response.data.data;
};

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
    return res.data.data;
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
