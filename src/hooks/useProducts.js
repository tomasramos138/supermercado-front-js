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


 const products = Array.isArray(productsData?.data || productsData)
   ? productsData.data || productsData
   : [];




 // ------- Stock Total -------
 const {
   data: totalStockData,
   isError: isStockError,
   error: stockError,
   isLoading: isStockLoading,
   refetch: refetchStock
 } = useQuery({
   queryKey: ["stocktotal"],
   queryFn: getTotalStock,
 });


 // El backend devuelve: { stocktotal: number }
 const totalStock = totalStockData?.stocktotal ?? 0;




 // ------- Mutaciones -------
 const updateProductFn = async ({ Productid, param }) => {
   if (!Productid || isNaN(Number(Productid))) {
     throw new Error("ID de producto inválido");
   }
   return updateProduct(Number(Productid), param);
 };


 const createProductFn = async (producto) => createProduct(producto);


 const uploadImageFn = async (id, imageFile) => {
   if (!id || isNaN(Number(id))) {
     throw new Error("ID de producto inválido para imagen");
   }
   return uploadImage(Number(id), imageFile);
 };




 // ------- Búsquedas -------
 const safeSearchByName = async (term) => {
   if (!term || typeof term !== "string") return [];
   const response = await searchProductsByName(term);
   return Array.isArray(response?.data || response)
     ? response.data || response
     : [];
 };


 const safeSearchByCategoria = async (categoriaId) => {
   if (!categoriaId || isNaN(Number(categoriaId))) return [];
   const response = await searchProductsByCategoria(Number(categoriaId));
   return Array.isArray(response?.data || response)
     ? response.data || response
     : [];
 };




 // ------- Retorno del hook -------
 return {
   products,
   totalStock,   // ⬅️ nombre correcto para Dashboard
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
