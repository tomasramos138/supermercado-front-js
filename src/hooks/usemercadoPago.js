import axiosInstance from "../axiosConfig";
import { useAuth } from "../hooks/useAuth";

function useMercadoPago() {
  const { token } = useAuth(); 

  const createPreference = async (payload) => {
    // Verificar que el payload tenga la estructura correcta
    if (!payload || !payload.items || !Array.isArray(payload.items)) {
      throw new Error("Datos del carrito inválidos");
    }

    if (!payload.clienteId) {
      throw new Error("Falta el ID del cliente");
    }

    if (!payload.distribuidorId) {
      throw new Error("Falta el ID del distribuidor");
    }

    try {
      console.log("Enviando al backend:", payload);
      const response = await axiosInstance.post(
        "/api/mercadopago/create-preference", 
        payload
      );
      
      console.log("Respuesta del backend:", response.data);
      return response.data;
      
    } catch (error) {
      console.error(
        "Error creando preferencia de pago:",
        error.response?.data || error.message
      );
      
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Error creando preferencia de pago";
      
      throw new Error(errorMessage);
    }
  };
  
  return { createPreference };
}

export default useMercadoPago;