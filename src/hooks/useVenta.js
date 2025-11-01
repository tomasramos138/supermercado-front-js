import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getVentasCount = async () => {
  const response = await axios.get("http://localhost:3000/api/venta/count");
  return response.data.data;
};

const getVentas = async () => {
  const response = await axios.get("http://localhost:3000/api/venta");
  return response.data.data;
};


// Función para procesar toda la compra
const procesarCompra = async (compraData) => {
  try {
    const response = await axios.post("http://localhost:3000/api/venta/procesarCompra", compraData);
    return response.data;
  } catch (error) {
    console.error('Error al procesar compra:', error);
    throw error;
  }
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
    procesarCompra
  };
}

export default useVenta;