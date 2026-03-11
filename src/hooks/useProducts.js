import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export const API_URL = import.meta.env.VITE_API_URL

const getProducts = async (token) => {
  const response = await axios.get(`${API_URL}/api/producto`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.data;
};

const searchProductsByName = async (param, token) => {
  const response = await axios.get(`${API_URL}/api/producto/search`, {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { q: param },
  });
  return response.data.data;
};

const searchProductsByCategoria = async (categoriaId, token) => {
  const response = await axios.get(`${API_URL}/api/producto/searchCat`, {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { categoriaId },
  });
  return response.data.data;
};

const getTotalStock = async (token) => {
  const response = await axios.get(`${API_URL}/api/producto/stockTotal`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.data;
};

const updateProduct = async (data, token) => {
  const response = await axios.put(`${API_URL}/api/producto/${data.Productid}`, data.param, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  alert("Producto actualizado correctamente");
  return response.data;
};


const createProduct = async (producto, token) => {
  const response = await axios.post(`${API_URL}/api/producto`, producto, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  alert("Producto creado correctamente");
  return response.data;
};

const uploadImage = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('imagen', imageFile);
  
  const response = await axios.post(`${API_URL}/api/producto/imagen`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

function useProducts() {
  const { token } = useAuth();

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token),
    enabled: !!token,
  });

  const { 
    data: totalStock, 
    refetch: refetchStock 
  } = useQuery({
    queryKey: ["totalStock"],
    queryFn: () => getTotalStock(token),
    enabled: !!token,
  });

  return {
    products: data,
    totalStock,
    isError,
    error,
    isLoading,
    refetchProducts: refetch,
    refetchStock,
    // Funciones que reciben token internamente
    createProduct: (producto) => createProduct(producto, token),
    updateProduct: (data) => updateProduct(data, token),
    uploadImage: (imageFile) => uploadImage(imageFile, token),
    searchProductsByName: (param) => searchProductsByName(param, token),
    searchProductsByCategoria: (categoriaId) => searchProductsByCategoria(categoriaId, token),
  };
}

export default useProducts;