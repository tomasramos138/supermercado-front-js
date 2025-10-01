import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Función para obtener el conteo de ventas
const getVentasCount = async () => {
  const response = await axios.get("http://localhost:3000/api/venta/count");
  return response.data.data;
};

// Función para obtener todas las ventas
const getVentas = async () => {
  const response = await axios.get("http://localhost:3000/api/venta");
  return response.data.data;
};

// Función para verificar stock
const verificarStock = async (items) => {
  try {
    const response = await axios.post("http://localhost:3000/api/venta/verificar-stock", { items });
    return response.data;
  } catch (error) {
    console.error('Error al verificar stock:', error);
    throw error;
  }
};

// Función para crear una venta
const crearVenta = async (ventaData) => {
  try {
    const response = await axios.post("http://localhost:3000/api/venta", ventaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear venta:', error);
    throw error;
  }
};

// Función para crear un item de venta
const crearItemVenta = async (itemData) => {
  try {
    const response = await axios.post("http://localhost:3000/api/item-venta", itemData);
    return response.data;
  } catch (error) {
    console.error('Error al crear item venta:', error);
    throw error;
  }
};

// Función para actualizar el total de una venta
const actualizarTotalVenta = async (ventaId, total) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/venta/${ventaId}`, { total });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar total venta:', error);
    throw error;
  }
};

// Función para procesar toda la compra
const procesarCompra = async (compraData) => {
  try {
    const { items, cliente, distribuidor } = compraData;

    // 1. Verificar stock
    await verificarStock(items);

    // 2. Crear la venta
    const ventaCreada = await crearVenta({
      fecha: new Date().toISOString(),
      total: 0, // El total se actualizará al final
      cliente: cliente,
      distribuidor: distribuidor,
    });

    const ventaId = ventaCreada.data.id;

    // 3. Crear los items de venta
    const promesasItems = items.map(item =>
      crearItemVenta({
        cantidad: item.cantidad,
        producto: item.productoId,
        venta: ventaId,
      })
    );

    const itemsCreados = await Promise.all(promesasItems);

    // 4. Actualizar el total de la venta
    const totalFinal = itemsCreados.reduce((total, item) => total + item.data.subtotal, 0);
    await actualizarTotalVenta(ventaId, totalFinal);

    return { ventaId, totalFinal, itemsCreados };
  } catch (error) {
    console.error('Error al procesar compra:', error);
    throw error;
  }
};

function useVenta() {
  // Query para el conteo de ventas
  const { 
    data: countData, 
    isError: isCountError, 
    error: countError, 
    isLoading: isCountLoading 
  } = useQuery({
    queryKey: ["ventasCount"],
    queryFn: getVentasCount,
  });

  // Query para obtener todas las ventas
  const { 
    data: ventasData, 
    isError: isVentasError, 
    error: ventasError, 
    isLoading: isVentasLoading 
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  return {
    // Datos del count
    ventasCount: countData,
    isCountError,
    countError,
    isCountLoading,
    
    // Datos de todas las ventas
    ventas: ventasData,
    isVentasError,
    ventasError,
    isVentasLoading,
    
    // Estados combinados
    isLoading: isCountLoading || isVentasLoading,
    isError: isCountError || isVentasError,

    // Funciones para operaciones
    verificarStock,
    crearVenta,
    crearItemVenta,
    actualizarTotalVenta,
    procesarCompra,
  };
}

export default useVenta;