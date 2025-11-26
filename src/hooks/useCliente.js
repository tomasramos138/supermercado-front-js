import { useQuery } from "@tanstack/react-query";
import {getClientesCount, updateClient, searchClientesByName } from "../services/api";


function useClientes() {
 const { data, isError, error, isLoading, refetch } = useQuery({
   queryKey: ["clientesCount"],
   queryFn: getClientesCount,
 });


 const updateClientFn = async ({ id, ...clientData }) => {
   try {
     const res = await updateClient(id, clientData);
     alert("Cliente modificado correctamente");
     return res;
   } catch (err) {
     console.error("Error al modificar el cliente:", err);
     throw err;
   }
 };


 const searchClientesByNameFn = (param) => searchClientesByName(param);


 return {
   clientesCount: data,
   isError,
   error,
   isLoading,
   refetchClientesCount: refetch,
   updateClient: updateClientFn,
   searchClientesByName: searchClientesByNameFn,
 };
}

export default useClientes;
