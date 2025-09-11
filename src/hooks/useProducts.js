import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getProducts = async () => {
  const response = await axios.get("http://localhost:3000/api/producto");
  return response.data.data;
};

const getTotalStock = async () => {
  const response = await axios.get("http://localhost:3000/api/producto/stockTotal");
  return response.data.data; 
};

function useProducts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { 
    data: totalStock, 
    isError: isStockError, 
    error: stockError, 
    isLoading: isStockLoading,
    refetch: refetchStock 
  } = useQuery({
    queryKey: ["totalStock"],
    queryFn: getTotalStock,
  });

  return {
    products: data,
    totalStock, 
    isError,
    error,
    isLoading,
    isStockError,
    stockError,
    isStockLoading,
    refetchStock,
  };
}

export default useProducts;
