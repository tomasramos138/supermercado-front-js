import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


// Paginas protegidas
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import Ventas from "./pages/dashboardPages/Ventas";
import GestionUsu from "./pages/dashboardPages/GestionUsu";
import NuevosProductos from "./pages/dashboardPages/NuevosProductos";
import GestionProductos from "./pages/dashboardPages/GestionProductos";
import ZonasDistribuidores from "./pages/dashboardPages/Zonas-distribuidores";
import Categoria from "./pages/dashboardPages/Categoria";


// Otras paginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/layouts/AuthLayout";
import SuccessPage from "./pages/SuccessPage";
import FailurePage from "./pages/FailurePage";

// Contextos y hooks
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
                 {/* Rutas accesibles para todos los usuarios autenticados (admin (True) o cliente (False)) */}
                 <Route path="/" element={<ProtectedRoute allowedRoles={['admin', 'usuario']}><ProductList /></ProtectedRoute>} />
                 <Route path="/products" element={<ProtectedRoute allowedRoles={['admin', 'usuario']}><ProductList /></ProtectedRoute>} />
                 <Route path="/products/profile" element={<ProtectedRoute allowedRoles={['admin', 'usuario']}><Profile /></ProtectedRoute>} />
                 <Route path="/payment/success" element={<ProtectedRoute allowedRoles={['admin', 'usuario']}><SuccessPage /></ProtectedRoute>} />
                 <Route path="/payment/failure" element={<ProtectedRoute allowedRoles={['admin', 'usuario']}><FailurePage /></ProtectedRoute>} />
                 {/* Rutas solo para administradores (True) */}
                 <Route path="/products/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>}/>
                 <Route path="/products/ventas" element={<ProtectedRoute allowedRoles={['admin']}><Ventas /></ProtectedRoute>}/>
                 <Route path="/products/zonas-distribuidores" element={<ProtectedRoute allowedRoles={['admin']}><ZonasDistribuidores /></ProtectedRoute>} />
                 <Route path="/products/NuevosProductos" element={<ProtectedRoute allowedRoles={['admin']}><NuevosProductos /></ProtectedRoute>}/>
                 <Route path="/products/GestionProductos" element={<ProtectedRoute allowedRoles={['admin']}><GestionProductos /></ProtectedRoute>} />
                 <Route path="/products/Categoria" element={ <ProtectedRoute allowedRoles={['admin']}> <Categoria /> </ProtectedRoute> }/>
                 <Route path="/clientes" element={<ProtectedRoute allowedRoles={['admin']}><div>Gestion de Usuarios (ADMIN)</div></ProtectedRoute>} />
                 <Route path="/products/GestionUsu" element={<ProtectedRoute allowedRoles={['admin']}><GestionUsu /></ProtectedRoute>}/>
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