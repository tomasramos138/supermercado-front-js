import { useQuery } from "@tanstack/react-query";
import { getVentasCount, getVentas, procesarCompra as procesarCompraAPI } from "../services/api";

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
    refetchCount,
    refetchVentas,
    procesarCompra,
  };
}

export default useVenta;
