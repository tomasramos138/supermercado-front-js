import { useQuery } from "@tanstack/react-query";
import { getVentasCount, getVentas, procesarCompra as procesarCompraAPI } from "../services/api";


function useVenta() {
 // Query para la cantidad de ventas
 const {
   data: ventasCount,
   isError: isCountError,
   error: countError,
   isLoading: isCountLoading,
   refetch: refetchCount
 } = useQuery({
   queryKey: ["ventasCount"],
   queryFn: getVentasCount, // ya devuelve los datos directamente
 });


 // Query para las ventas
 const {
   data: ventas,
   isError: isVentasError,
   error: ventasError,
   isLoading: isVentasLoading,
   refetch: refetchVentas
 } = useQuery({
   queryKey: ["ventas"],
   queryFn: getVentas, // ya devuelve los datos directamente
 });


 // Función de mutación para procesar compra
 const procesarCompra = async (compraData) => {
   try {
     return await procesarCompraAPI(compraData);
   } catch (err) {
     console.error("Error al procesar compra:", err);
     throw err;
   }
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
   procesarCompra
 };
}


export default useVenta;
