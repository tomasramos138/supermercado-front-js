import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCategoria = async () => {
  const response = await axios.get("http://localhost:3000/api/categoria");
  return response.data.data;
 };

const searchCategoriasByName = async (param) => {
  const response = await axios.get("http://localhost:3000/api/categoria/search", {
    params: { q: param },
  });
  return response.data.data;
};

 const createCategoria = async (categoriaData) => {
  try {
    const response = await axios.post("http://localhost:3000/api/categoria", categoriaData);
    alert("Categoría creada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    alert("Error al crear la categoría ");
    throw error;
  }
 };
 
 const deleteCategoria = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/categoria/${id}`);
    alert("Categoría eliminada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    alert("Error al eliminar la categoría");
    throw error;
  }
 };
 
 const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/categoria/${id}`, categoriaData);
    alert("Categoría actualizada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    alert("Error al actualizar la categoría");
    throw error;
  }
 }
 
 function useCategoria() {
  
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategoria,
  });
 
 
  return {
    categorias: data,
    isError,
    error,
    isLoading,
    createCategoria,
    refetchCategorias: refetch,
    updateCategoria,
    deleteCategoria,
    searchCategoriasByName,
  };
 }
 
 
 export default useCategoria;