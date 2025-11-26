import { useQuery } from "@tanstack/react-query";
import {
 getZonas,
 searchZonasByName,
 createZona,
 deleteZona,
 updateZona
} from "../services/api";


function useZonas() {
 const { data, isError, error, isLoading, refetch } = useQuery({
   queryKey: ["zonas"],
   queryFn: getZonas,
 });


 // zonas = SOLO el array []
 const zonas = data?.data ?? [];


 return {
   zonas,
   isError,
   error,
   isLoading,
   refetchZonas: refetch,
   createZona: async (zonaData) => await createZona(zonaData),
   updateZona: async (id, zonaData) => await updateZona(id, zonaData),
   deleteZona: async (id) => await deleteZona(id),
   searchZonasByName: async (param) => await searchZonasByName(param),
 };
}


export default useZonas;
