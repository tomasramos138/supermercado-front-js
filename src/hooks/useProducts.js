import { useQuery } from "@tanstack/react-query";
import { 
  getProducts,
  searchProductsByName,
  searchProductsByCategoria,
  getTotalStock,
  updateProduct,
  createProduct,
  uploadImage
} from "../services/api";

function useProducts() {
  const { 
    data, 
    isError, 
    error, 
    isLoading,
    refetch: refetchProducts 
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getProducts();
      return res.data.data;
    },
  });

  const { 
    data: totalStock, 
    isError: isStockError, 
    error: stockError, 
    isLoading: isStockLoading,
    refetch: refetchStock 
  } = useQuery({
    queryKey: ["totalStock"],
    queryFn: async () => {
      const res = await getTotalStock();
      return res.data.data;
    },
  });

  const updateProductFn = async ({ Productid, param }) => {
    try {
      const res = await updateProduct(Productid, param);
      return res.data;
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      throw err;
    }
  };

  const createProductFn = async (producto) => {
    try {
      const res = await createProduct(producto);
      return res.data;
    } catch (err) {
      console.error("Error al crear producto:", err);
      throw err;
    }
  };

  const uploadImageFn = async (id, imageFile) => {
    try {
      const res = await uploadImage(id, imageFile);
      return res.data;
    } catch (err) {
      console.error("Error al subir imagen:", err);
      throw err;
    }
  };

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
    createProduct: createProductFn,
    updateProduct: updateProductFn,
    uploadImage: uploadImageFn,
    searchProductsByName,
    searchProductsByCategoria,
  };
}

export default useProducts;
