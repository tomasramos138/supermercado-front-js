import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL

const getVentasCount = async () => {
  const response = await axios.get(`${API_URL}/api/venta/count`);
  return response.data.data;
};

const getVentas = async () => {
  const response = await axios.get(`${API_URL}/api/venta`);
  return response.data.data;
};

const getVentaById = async (ventaId) => {
  const response = await axios.get(`${API_URL}/api/venta/${ventaId}`);
  return response.data.data;
};

function useVenta() {
  const { 
    data: countData, 
    isError: isCountError, 
    error: countError, 
    isLoading: isCountLoading 
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: getVentasCount,
  });

  const { 
    data: ventasData, 
    isError: isVentasError, 
    error: ventasError, 
    isLoading: isVentasLoading 
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  return {
    ventasCount: countData,
    isCountError,
    countError,
    isCountLoading,
    ventas: ventasData,
    isVentasError,
    ventasError,
    isVentasLoading,
    isLoading: isCountLoading || isVentasLoading,
    isError: isCountError || isVentasError,
    getVentaById
  };
}

export default useVenta;