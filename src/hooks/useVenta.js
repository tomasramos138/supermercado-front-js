import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth"; 

export const API_URL = import.meta.env.VITE_API_URL

const getVentasCount = async (token) => {
  const response = await axios.get(`${API_URL}/api/venta/count`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  return response.data.data;
};

const getVentas = async (token) => {
  const response = await axios.get(`${API_URL}/api/venta`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  return response.data.data;
};

const getVentaById = async (ventaId, token) => { 
  const response = await axios.get(`${API_URL}/api/venta/${ventaId}`, {
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  return response.data.data;
};

function useVenta() {
  const { token } = useAuth();

  const { 
    data: countData, 
    isError: isCountError, 
    error: countError, 
    isLoading: isCountLoading,
    refetch: refetchCount 
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: () => getVentasCount(token), 
    enabled: !!token,
  });

  const { 
    data: ventasData, 
    isError: isVentasError, 
    error: ventasError, 
    isLoading: isVentasLoading,
    refetch: refetchVentas 
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: () => getVentas(token), 
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
    getVentaById: (ventaId) => getVentaById(ventaId, token),
  };
}

export default useVenta;