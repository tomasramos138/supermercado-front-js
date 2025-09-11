import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getVentasCount = async () => {
  const response = await axios.get("http://localhost:3000/api/venta/count");
  return response.data.data;
};

function useVentasCount() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: getVentasCount,
  });

  return {
    ventasCount: data,
    isError,
    error,
    isLoading,
  };
}

export default useVentasCount;