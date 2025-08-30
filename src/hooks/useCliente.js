import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getClientesCount = async () => {
  const response = await axios.get("http://localhost:3000/api/cliente/count");
  return response.data.data; // solo el número
};

const updateClient = async ({ id, ...clientData }) => {
  const response = await axios.patch(`http://localhost:3000/api/cliente/${id}`,clientData
  );
  return response.data;
};

function useClientes() {
  const queryClient = useQueryClient();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: getClientesCount,
  });

  const mutation = useMutation({
    //El useMutation es como el useQuery pero para funciones de POST, PUT, DELETE
    mutationFn: updateClient,
  });

  return {
    clientesCount: data,
    isError,
    error,
    isLoading,
    updateClient: mutation.mutate, // función para ejecutar update
    updateStatus: mutation, // estados de la mutación (isLoading, isError, etc.)
  };
}

export default useClientes; 