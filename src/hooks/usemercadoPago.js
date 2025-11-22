import { createPreference as createPreferenceAPI } from "../services/api";

function useMercadoPago() {
  // Recibe el carrito y crea la preferencia en el backend
  const createPreference = async (cart) => {
    if (!cart || cart.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // Convertimos todos los productos del carrito al formato que espera el backend
    const items = cart.map(item => ({
      title: item.name,
      quantity: Number(item.quantity),
      price: Number(item.precio),
    }));

    try {
      const res = await createPreferenceAPI({ items }); // usamos la función del helper
      // Devuelvo todo el objeto para obtener init_point y id de la preferencia
      return res.data;
    } catch (error) {
      console.error("Error creando preferencia de pago:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Error creando preferencia de pago");
    }
  };

  return { createPreference };
}

export default useMercadoPago;
