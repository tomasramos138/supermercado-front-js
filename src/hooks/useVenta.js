import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";


const getVentasCount = async () => {
  const response = await axiosInstance.get("/api/venta/count");
  return response.data.data;
};

const getVentas = async () => {
  const response = await axiosInstance.get("/api/venta");
  return response.data.data;
};

const getVentaById = async (ventaId) => {
  const response = await axiosInstance.get(`/api/venta/${ventaId}`);
  return response.data.data;
};

function useVenta() {
  const { token } = useAuth();

  const { data: countData, isError: isCountError, error: countError, isLoading: isCountLoading, refetch: refetchCount 
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: getVentasCount, 
    enabled: !!token, 
  });

  const { data: ventasData, isError: isVentasError, error: ventasError, isLoading: isVentasLoading, refetch: refetchVentas 
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas, 
    enabled: !!token, 
  });

  return {
    ventasCount: countData,
    isCountError,
    countError,
    isCountLoading,
    refetchCount,
    ventas: ventasData,
    isVentasError,
    ventasError,
    isVentasLoading,
    refetchVentas,
    isLoading: isCountLoading || isVentasLoading,
    isError: isCountError || isVentasError,
    getVentaById,
  };
}

export default useVenta;