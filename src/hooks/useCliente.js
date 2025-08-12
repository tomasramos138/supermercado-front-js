import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getClientesCount = async () => {
  const response = await axios.get("http://localhost:3000/api/cliente/count");
  return response.data.data; // solo el número
};

function useClientesCount() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["clientesCount"],
    queryFn: getClientesCount,
  });

  return {
    clientesCount: data,
    isError,
    error,
    isLoading,
  };
}

export default useClientesCount;