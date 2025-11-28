import { createPreference as createPreferenceAPI } from "../services/api";


function useMercadoPago() {
 const createPreference = async (cart) => {
   if (!cart || cart.length === 0) {
     throw new Error("El carrito está vacío");
   }


   // Convertimos los productos al formato que espera el backend
   const items = cart.map(item => ({
     title: item.name,
     quantity: Number(item.quantity),
     price: Number(item.precio),
   }));


   try {
     // La función del API ya devuelve los datos directamente
     return await createPreferenceAPI({ items });
   } catch (error) {
     console.error(
       "Error creando preferencia de pago:",
       error.response?.data.data || error.message
     );
     throw new Error(
       error.response?.data?.error || "Error creando preferencia de pago"
     );
   }
 };

 return { createPreference };
}

export default useMercadoPago;
