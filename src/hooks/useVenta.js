import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Función para obtener el conteo de ventas
const getVentasCount = async () => {
  const response = await axios.get("http://localhost:3000/api/venta/count");
  return response.data.data;
};

// Función para obtener todas las ventas
const getVentas = async () => {
  const response = await axios.get("http://localhost:3000/api/venta");
  return response.data.data;
};

function useVentas() {
  // Query para el conteo de ventas
  const { 
    data: countData, 
    isError: isCountError, 
    error: countError, 
    isLoading: isCountLoading 
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: getVentasCount,
  });

  // Query para obtener todas las ventas
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
    // Datos del count
    ventasCount: countData,
    isCountError,
    countError,
    isCountLoading,
    
    // Datos de todas las ventas
    ventas: ventasData,
    isVentasError,
    ventasError,
    isVentasLoading,
    
    // Estados combinados
    isLoading: isCountLoading || isVentasLoading,
    isError: isCountError || isVentasError,
  };
}

export default useVentas;