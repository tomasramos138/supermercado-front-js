import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL

const getProducts = async () => {
  const response = await axios.get(`${API_URL}/api/producto`);
  return response.data.data;
};

const searchProductsByName = async (param) => {
  const response = await axios.get(`${API_URL}/api/producto/search`, {
    params: { q: param },
  });
  return response.data.data;
};

const searchProductsByCategoria = async (categoriaId) => {
  const response = await axios.get(`${API_URL}/api/producto/searchCat`, {
    params: { categoriaId: categoriaId }, 
  });
  return response.data.data;
};

const getTotalStock = async () => {
  const response = await axios.get(`${API_URL}/api/producto/stockTotal`);
  return response.data.data; 
};

const updateProduct = async ({ Productid, param }) => {
  const response = await axios.put(`${API_URL}/api/producto/${Productid}`, param);
  return response.data;
};

const createProduct = async (producto) => {
  const response = await axios.post(`${API_URL}/api/producto`, producto);
  return response.data;
};

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('imagen', imageFile);
  
  const response = await axios.post( `${API_URL}/api/producto/imagen`, formData, 
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
    updateProduct,
    uploadImage,
    searchProductsByName,
    searchProductsByCategoria,
  };
}

export default useProducts;