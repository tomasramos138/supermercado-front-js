// src/services/api.js
import axios from "axios";

// ✅ Vite style
export const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("Variable VITE_API_URL no definida");

// --- Clientes ---
export const updateClient = async (id, clientData) =>
  (await axios.patch(`${API_URL}/api/cliente/${id}`, clientData)).data;

export const searchClientesByName = async (param) => {
  const res = await axios.get(`${API_URL}/api/cliente/search?name=${param}`);
  return res.data.data; // <- solo el array
};

export const getClientesCount = async () =>
  (await axios.get(`${API_URL}/api/cliente/count`)).data;

// --- Categorías ---
export const getCategorias = async () => {
  const res = await axios.get(`${API_URL}/api/categoria`);
  return res.data.data; // <- solo el array
};

export const createCategoria = async (data) =>
  (await axios.post(`${API_URL}/api/categoria`, data)).data;

export const updateCategoria = async (id, data) =>
  (await axios.patch(`${API_URL}/api/categoria/${id}`, data)).data;

export const deleteCategoria = async (id) =>
  (await axios.delete(`${API_URL}/api/categoria/${id}`)).data;

export const searchCategoriasByName = async (param) => {
  const res = await axios.get(`${API_URL}/api/categoria/search?name=${param}`);
  return res.data.data; // <- solo el array
};

// --- Distribuidores ---
export const getDistribuidoresByZona = async (zonaId) => {
  const res = await axios.get(`${API_URL}/api/distribuidor/zona/${zonaId}`);
  return res.data.data; // <- solo el array
};

export const createDistribuidor = async (data) =>
  (await axios.post(`${API_URL}/api/distribuidor`, data)).data;

export const updateDistribuidor = async (id, data) =>
  (await axios.patch(`${API_URL}/api/distribuidor/${id}`, data)).data;

export const deleteDistribuidor = async (id) =>
  (await axios.delete(`${API_URL}/api/distribuidor/${id}`)).data;

// --- MercadoPago ---
export const createPreference = async (data) =>
  (await axios.post(`${API_URL}/api/mercadopago/create-preference`, data)).data;

// --- Productos ---
export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/api/producto`);
  return res.data.data; // <- solo el array
};

export const searchProductsByName = async (param) => {
  const res = await axios.get(`${API_URL}/api/producto/search?q=${param}`);
  return res.data.data; // <- solo el array
};

export const searchProductsByCategoria = async (categoriaId) => {
  const res = await axios.get(`${API_URL}/api/producto/categoria/${categoriaId}`);
  return res.data.data; // <- solo el array
};

export const updateProduct = async (id, data) =>
  (await axios.patch(`${API_URL}/api/producto/${id}`, data)).data;

export const getTotalStock = async () =>
  (await axios.get(`${API_URL}/api/producto/stocktotal`)).data;

export const createProduct = async (data) =>
  (await axios.post(`${API_URL}/api/producto`, data)).data;

export const uploadImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("imagen", imageFile);
  return (await axios.post(`${API_URL}/api/producto/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};

// --- Ventas ---
export const getVentas = async () => {
  const res = await axios.get(`${API_URL}/api/venta`);
  return res.data.data; // <- solo el array
};

export const getVentasCount = async () =>
  (await axios.get(`${API_URL}/api/venta/count`)).data;

export const procesarCompra = async (compraData) =>
  (await axios.post(`${API_URL}/api/venta/procesarCompra`, compraData)).data;

// --- Zonas ---
export const getZonas = async () => {
  const res = await axios.get(`${API_URL}/api/zona`);
  return res.data.data; // <- solo el array
};

export const createZona = async (data) =>
  (await axios.post(`${API_URL}/api/zona`, data)).data;

export const updateZona = async (id, data) =>
  (await axios.patch(`${API_URL}/api/zona/${id}`, data)).data;

export const deleteZona = async (id) =>
  (await axios.delete(`${API_URL}/api/zona/${id}`)).data;

export const searchZonasByName = async (param) => {
  const res = await axios.get(`${API_URL}/api/zona/search?name=${param}`);
  return res.data.data; // <- solo el array
};
