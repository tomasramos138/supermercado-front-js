import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getProducts = async () => {
  const response = await axios.get("http://localhost:3000/api/producto");
  return response.data.data;
};

const createProduct = async (newProduct) => {
  const response = await axios.post("http://localhost:3000/api/producto", newProduct);
  return response.data.data;
};

function useProducts() {
  const queryClient = useQueryClient();
  
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalida la caché de productos y los vuelve a cargar
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: data,
    isError,
    error,
    isLoading,
    addProduct: mutation.mutate,
    isAdding: mutation.isLoading,
    addError: mutation.error,
    isAddSuccess: mutation.isSuccess,
  };
}

export default useProducts;
