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

  // ------- Cantidad de Ventas -------
  const {
    data: ventasCountData,
    isError: isCountError,
    error: countError,
    isLoading: isCountLoading,
    refetch: refetchCount
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: getVentasCount,
  });

  // ✔️ EXTRAER SOLO EL NÚMERO
  const ventasCount = ventasCountData?.data ?? 0;


  // ------- Listado de Ventas -------
  const {
    data: ventas,
    isError: isVentasError,
    error: ventasError,
    isLoading: isVentasLoading,
    refetch: refetchVentas
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });


  // ------- Procesar Compra -------
  const procesarCompra = async (compraData) => {
    return await procesarCompraAPI(compraData);
  };

  return {
    ventasCount,
    isCountError,
    countError,
    isCountLoading,
    ventas,
    isVentasError,
    ventasError,
    isVentasLoading,
    isLoading: isCountLoading || isVentasLoading,
    isError: isCountError || isVentasError,
    getVentaById
  };
}

export default useVenta;
