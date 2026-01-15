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

  // ------- Productos -------
  const {
    data: productsData,
    isError,
    error,
    isLoading,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // backend = { message, data: [...] }
  const products = productsData?.data ?? [];


  // ------- Stock Total -------
  const {
    data: totalStockData,
    isError: isStockError,
    error: stockError,
    isLoading: isStockLoading,
    refetch: refetchStock
  } = useQuery({
    queryKey: ["totalStock"],
    queryFn: getTotalStock,
  });

  const totalStock = totalStockData?.stocktotal ?? 0;


  // ------- Mutaciones -------
  const updateProductFn = async ({ Productid, param }) => {
    if (!Productid || isNaN(Number(Productid))) throw new Error("ID inválido");
    return updateProduct(Number(Productid), param);
  };

  const createProductFn = async (producto) => createProduct(producto);

  const uploadImageFn = async (id, imageFile) => {
    if (!id || isNaN(Number(id))) throw new Error("ID inválido");
    return uploadImage(Number(id), imageFile);
  };


  // ------- Búsquedas -------
  const safeSearchByName = async (term) => {
    if (!term) return [];
    const response = await searchProductsByName(term);
    return response?.data ?? [];
  };

  const safeSearchByCategoria = async (categoriaId) => {
    if (!categoriaId) return [];
    const response = await searchProductsByCategoria(Number(categoriaId));
    return response?.data ?? [];
  };


  return {
    products,
    totalStock,
    isError,
    error,
    isLoading,
    isStockError,
    stockError,
    isStockLoading,
    refetchProducts,
    refetchStock,
    createProduct: createProductFn,
    updateProduct: updateProductFn,
    uploadImage: uploadImageFn,
    searchProductsByName: safeSearchByName,
    searchProductsByCategoria: safeSearchByCategoria,
  };
}

export default useProducts;
