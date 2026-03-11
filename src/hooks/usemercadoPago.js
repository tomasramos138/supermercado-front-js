import axios from 'axios';
import { useAuth } from "../hooks/useAuth";

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createPreferenceAPI = async (data, token) => {
  console.log("Enviando al backend:", data);
  return (await axios.post(`${API_URL}/api/mercadopago/create-preference`, data, {
    headers: { 'Authorization': `Bearer ${token}` } 
  })).data;
};

function useMercadoPago() {
  const { token } = useAuth(); 

  const createPreference = async (payload) => {
    // Verificar que el payload tenga la estructura correcta
    if (!payload || !payload.items || !Array.isArray(payload.items)) {
      throw new Error("Datos del carrito invÃ¡lidos");
    }

    if (!payload.clienteId) {
      throw new Error("Falta el ID del cliente");
    }

    if (!payload.distribuidorId) {
      throw new Error("Falta el ID del distribuidor");
    }

    try {
      const response = await createPreferenceAPI(payload, token);
      console.log("Respuesta del backend:", response);
      return response;
    } catch (error) {
      console.error(
        "Error creando preferencia de pago:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Error creando preferencia de pago"
      );
    }
  };
  
  return { createPreference };
}

export default useMercadoPago;