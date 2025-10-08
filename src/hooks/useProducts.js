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

const updateStock = async ({ id, stock }) => {
  const response = await axios.put(`http://localhost:3000/api/producto/${id}`, { stock });
  return response.data;
};

const createProduct = async (producto) => {
  const response = await axios.post("http://localhost:3000/api/producto", producto);
  return response.data;
};

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('imagen', imageFile);
  
  const response = await axios.post( "http://localhost:3000/api/producto/imagen", formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

function useProducts() {
  const { 
    data, 
    isError, 
    error, 
    isLoading,
    refetch: refetchProducts 
  } = useQuery({
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
    refetchProducts,
    refetchStock,   
    createProduct,
    updateStock,
    uploadImage,
  };
}

export default useProducts;
