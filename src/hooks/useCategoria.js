import { useQuery } from "@tanstack/react-query";
import { 
  getCategorias,
  searchCategoriasByName,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../services/api";

function useCategoria() {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getCategorias().then(res => res.data.data),
  });

  const createCategoriaFn = (categoriaData) => {
    return createCategoria(categoriaData)
      .then(res => {
        alert("Categoría creada correctamente");
        return res.data;
      })
      .catch(err => {
        console.error("Error al crear la categoría:", err);
        alert("Error al crear la categoría");
        throw err;
      });
  };

  const updateCategoriaFn = (id, categoriaData) => {
    return updateCategoria(id, categoriaData)
      .then(res => {
        alert("Categoría actualizada correctamente");
        return res.data;
      })
      .catch(err => {
        console.error("Error al actualizar la categoría:", err);
        alert("Error al actualizar la categoría");
        throw err;
      });
  };

  const deleteCategoriaFn = (id) => {
    return deleteCategoria(id)
      .then(res => {
        alert("Categoría eliminada correctamente");
        return res.data;
      })
      .catch(err => {
        console.error("Error al eliminar la categoría:", err);
        alert("Error al eliminar la categoría");
        throw err;
      });
  };

  const searchCategoriasByNameFn = (param) => {
    return searchCategoriasByName(param).then(res => res.data.data);
  };

  return {
    categorias: data,
    isError,
    error,
    isLoading,
    refetchCategorias: refetch,
    createCategoria: createCategoriaFn,
    updateCategoria: updateCategoriaFn,
    deleteCategoria: deleteCategoriaFn,
    searchCategoriasByName: searchCategoriasByNameFn,
  };
}

export default useCategoria;
