import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import Ventas from "./pages/dashboardPages/Ventas";
import GestionUsu from "./pages/dashboardPages/GestionUsu";
import NuevosProductos from "./pages/dashboardPages/NuevosProductos";
import Stock from "./pages/dashboardPages/Stock";
import NuevaCategoria from "./pages/dashboardPages/NuevaCategoria";
import Zonasydistribuidores from "./pages/dashboardPages/Zonasydistribuidores";

// Other components
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute"; // Importa tu ProtectedRoute
import AuthLayout from "./components/layouts/AuthLayout"; // Importa AuthLayout directamente

// Context and HooksS
import { AuthProvider } from "./providers/AuthProvider";
import { CartProvider } from './providers/CartProvider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<AuthLayout />}>
                  {/* Rutas accesibles para todos los usuarios autenticados (admin o cliente) */}
                  <Route path="/" element={<ProtectedRoute allowedRoles={[true, false]}><ProductList /></ProtectedRoute>} />
                  <Route path="/products" element={<ProtectedRoute allowedRoles={[true, false]}><ProductList /></ProtectedRoute>} />
                  <Route path="/products/profile" element={<ProtectedRoute allowedRoles={[true, false]}><Profile /></ProtectedRoute>} />
                  {/* Rutas solo para administradores */}
                  <Route path="/products/dashboard" element={<ProtectedRoute allowedRoles={[true]}><Dashboard /></ProtectedRoute>}/>
                  <Route path="/products/ventas" element={<ProtectedRoute allowedRoles={[true]}><Ventas /></ProtectedRoute>}/>
                  <Route path="/products/Zonasydistribuidores" element={<ProtectedRoute allowedRoles={[true]}> <Zonasydistribuidores/> </ProtectedRoute>} />
{/*aca*/}         <Route path="/products/NuevosProductos" element={<ProtectedRoute allowedRoles={[true]}><NuevosProductos /></ProtectedRoute>}/>
                  <Route path="/products/Stock" element={<ProtectedRoute allowedRoles={[true]}><Stock /></ProtectedRoute>} />
                  <Route path="/categorias/nueva" element={ <ProtectedRoute allowedRoles={[true]}> <NuevaCategoria /> </ProtectedRoute> }/>
                  <Route path="/clientes" element={<ProtectedRoute allowedRoles={[true]}><div>Gestion de Usuarios (ADMIN)</div></ProtectedRoute>} />
                  <Route path="/products/GestionUsu" element={<ProtectedRoute allowedRoles={[true]}><GestionUsu /></ProtectedRoute>}/>

                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;