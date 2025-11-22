import axios from 'axios';

 const API_URL = process.env.NEXT_PUBLIC_API_URL; 

if (!API_URL) {
  throw new Error("Variable NEXT_PUBLIC_API_URL no definida en .env.local");
}
// --- Clientes ---
export const getClientes = () => axios.get(`${API_URL}/api/cliente`);
export const updateCliente = (id, clientData) => axios.patch(`${API_URL}/api/cliente/${id}`, clientData);
export const searchClientesByName = (param) => axios.get(`${API_URL}/api/cliente/search?name=${param}`);
export const getClientesCount = () => axios.get(`${API_URL}/api/cliente/count`);

// --- Categorias ---
export const getCategorias = () => axios.get(`${API_URL}/api/categoria`);
export const createCategoria = (categoriaData) => axios.post(`${API_URL}/api/categoria`, categoriaData);
export const updateCategoria = (id, categoriaData) => axios.patch(`${API_URL}/api/categoria/${id}`, categoriaData);
export const deleteCategoria = (id) => axios.delete(`${API_URL}/api/categoria/${id}`);
export const searchCategoriasByName = (param) => axios.get(`${API_URL}/api/categoria/search?name=${param}`);

// --- Distribuidores ---
export const getDistribuidoresByZona = (zonaId) => axios.get(`${API_URL}/api/distribuidor/zona/${zonaId}`);
export const createDistribuidor = (distribuidorData) => axios.post(`${API_URL}/api/distribuidor`, distribuidorData);
export const updateDistribuidor = (distribuidorId, data) => axios.patch(`${API_URL}/api/distribuidor/${distribuidorId}`, data);
export const deleteDistribuidor = (distribuidorId) => axios.delete(`${API_URL}/api/distribuidor/${distribuidorId}`);

// --- MercadoPago ---
export const createPreference = (data) => axios.post(`${API_URL}/api/mercadopago/create-preference`, data);

// --- Productos ---
export const getProducts = () => axios.get(`${API_URL}/api/producto`);
export const searchProductsByName = (param) => axios.get(`${API_URL}/api/producto/search?name=${param}`);
export const searchProductsByCategoria = (categoriaId) => axios.get(`${API_URL}/api/producto/categoria/${categoriaId}`);
export const updateProduct = (Productid, param) => axios.patch(`${API_URL}/api/producto/${Productid}`, param);
export const createProduct = (producto) => axios.post(`${API_URL}/api/producto`, producto);
export const uploadImage = (id,imageFile) => axios.post(`${API_URL}/api/producto/${id}/upload`,imageFile);
export const getTotalStock = () => axios.get(`${API_URL}/api/producto/total-stock`);

// --- Ventas ---
export const getVentas = () => axios.get(`${API_URL}/api/venta`);
export const getVentasCount = () => axios.get(`${API_URL}/api/venta/count`);

// --- Zonas ---
export const getZonas = () => axios.get(`${API_URL}/api/zona`);
export const createZona = (zonaData) => axios.post(`${API_URL}/api/zona`,zonaData);
export const updateZona = (id, data) => axios.patch(`${API_URL}/api/zona/${id}`, data);
export const deleteZona = (zonaId) => axios.delete(`${API_URL}/api/zona/${zonaId}`);
export const searchZonasByName = (param) => axios.get(`${API_URL}/api/zona/search?name=${param}`);
