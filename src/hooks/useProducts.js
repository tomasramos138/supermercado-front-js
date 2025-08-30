import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getProducts = async () => {
  const response = await axios.get("http://localhost:3000/api/producto");
  return response.data.data;
};


function useProducts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return {
    products: data,
    isError,
    error,
    isLoading,
  };
}

export default useProducts;
