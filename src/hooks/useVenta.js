import { useQuery } from "@tanstack/react-query";
import { getVentasCount, getVentas, procesarCompra as procesarCompraAPI } from "../services/api";

function useVenta() {
  const { 
    data: countData, 
    isError: isCountError, 
    error: countError, 
    isLoading: isCountLoading,
    refetch: refetchCount
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: async () => {
      const res = await getVentasCount();
      return res.data.data;
    },
  });

  const { 
    data: ventasData, 
    isError: isVentasError, 
    error: ventasError, 
    isLoading: isVentasLoading,
    refetch: refetchVentas
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: async () => {
      const res = await getVentas();
      return res.data.data;
    },
  });

  const procesarCompraFn = async (compraData) => {
    try {
      const res = await procesarCompraAPI(compraData);
      return res.data;
    } catch (err) {
      console.error("Error al procesar compra:", err);
      throw err;
    }
  };

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
    refetchCount,
    refetchVentas,
    procesarCompra: procesarCompraFn
  };
}

export default useVenta;
