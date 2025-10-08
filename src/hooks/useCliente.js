import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getClientesCount = async () => {
  const response = await axios.get("http://localhost:3000/api/cliente/count");
  return response.data.data;
};

const updateClient = async ({ id, ...clientData }) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/cliente/${id}`, clientData);
    alert('Cliente modificado correctamente');
    return response.data;
  } catch (error) {
    console.error('Error al modificar el cliente:', error);
    throw error;
  }
};

const searchClientesByName = async (nombre) => {
  const response = await axios.get("http://localhost:3000/api/cliente/search", {
    params: { q: nombre },
  });
  return response.data.data;
};

function useClientes() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: getClientesCount,
  });
  
  return {
    clientesCount: data,
    isError,
    error,
    isLoading,
    updateClient,
    searchClientesByName,
  };
}

export default useClientes;