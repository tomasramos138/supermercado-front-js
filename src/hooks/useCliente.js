import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig"; 
import { useAuth } from "../hooks/useAuth";

const getClientesCount = async () => {
  const response = await axiosInstance.get("/api/cliente/count");
  return response.data.data;
};

const updateClient = async ({ id, ...clientData }) => {
  try {
    const response = await axiosInstance.patch(`/api/cliente/${id}`, clientData);
    alert('Cliente modificado correctamente');
    return response.data;
  } catch (error) {
    console.error('Error al modificar el cliente:', error);
    alert('Error al modificar el cliente');
    throw error;
  }
};

const searchClientesByName = async (param) => {
  const response = await axiosInstance.get("/api/cliente/search", {
    params: { q: param },
  });
  return response.data.data;
};

function useClientes() {
  const { token } = useAuth();

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: getClientesCount, 
    enabled: !!token,
  });
  
  return {
    clientesCount: data,
    isError,
    error,
    isLoading,
    refetchClientesCount: refetch,
    updateClient,
    searchClientesByName,
  };
}

export default useClientes;