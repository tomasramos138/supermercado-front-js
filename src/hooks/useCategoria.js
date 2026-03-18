import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";

const getCategoria = async () => {
  const response = await axiosInstance.get("/api/categoria");
  return response.data.data;
};

const searchCategoriasByName = async (param) => {
  const response = await axiosInstance.get("/api/categoria/search", {
    params: { q: param },
  });
  return response.data.data;
};

const createCategoria = async (categoriaData) => {
  try {
    const response = await axiosInstance.post("/api/categoria", categoriaData);
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
    const response = await axiosInstance.delete(`/api/categoria/${id}`);
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
    const response = await axiosInstance.put(`/api/categoria/${id}`, categoriaData);
    alert("Categoría actualizada correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    alert("Error al actualizar la categoría");
    throw error;
  }
};

function useCategoria() {
  const { token } = useAuth();
  
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategoria,
    enabled: !!token, // Nos aseguramos que solo se ejecute si hay un token
  });

  return {
    categorias: data,
    isError,
    error,
    isLoading,
    createCategoria,
    deleteCategoria,
    updateCategoria,
    searchCategoriasByName,
    refetchCategorias: refetch,
  };
}

export default useCategoria;