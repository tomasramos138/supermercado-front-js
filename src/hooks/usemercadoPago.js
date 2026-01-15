import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createPreferenceAPI = async (data) => {
  console.log("Enviando al backend:", data);
  return (await axios.post(`${API_URL}/api/mercadopago/create-preference`, data)).data;
};

function useMercadoPago() {
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
      // La función del API ya devuelve los datos directamente
      const response = await createPreferenceAPI(payload);
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
