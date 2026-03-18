import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";


const getProducts = async () => {
  const response = await axiosInstance.get("/api/producto");
  return response.data.data;
};

const searchProductsByName = async (param) => {
  const response = await axiosInstance.get("/api/producto/search", {
    params: { q: param },
  });
  return response.data.data;
};

const searchProductsByCategoria = async (categoriaId) => {
  const response = await axiosInstance.get("/api/producto/searchCat", {
    params: { categoriaId },
  });
  return response.data.data;
};

const getTotalStock = async () => {
  const response = await axiosInstance.get("/api/producto/stockTotal");
  return response.data.data;
};

const updateProduct = async (data) => {
  try {
    const response = await axiosInstance.put(`/api/producto/${data.Productid}`, data.param);
    alert("Producto actualizado correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    alert("Error al actualizar el producto");
    throw error;
  }
};

const createProduct = async (producto) => {
  try {
    const response = await axiosInstance.post("/api/producto", producto);
    alert("Producto creado correctamente");
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    alert("Error al crear el producto");
    throw error;
  }
};

const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    
    const response = await axiosInstance.post("/api/producto/imagen", formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    alert("Error al subir la imagen");
    throw error;
  }
};

function useProducts() {
  const { token } = useAuth();
  const { data: products, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: !!token,
  });

  const { data: totalStock, refetch: refetchStock } = useQuery({
    queryKey: ["totalStock"],
    queryFn: getTotalStock, 
    enabled: !!token,
  });

  return {
    products,
    totalStock,
    isError,
    error,
    isLoading,
    refetchProducts: refetch,
    refetchStock,
    createProduct,
    updateProduct,
    uploadImage,
    searchProductsByName,
    searchProductsByCategoria,
  };
}

export default useProducts;