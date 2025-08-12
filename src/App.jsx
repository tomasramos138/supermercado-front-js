import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";



// Protected Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import Carrito from "./pages/Carrito";

// Other components
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Context and HooksS
import { AuthProvider } from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>


              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> 

              <Route
                path="/products"
                element={<ProtectedRoute allowedRoles={[true,false]} />}
              >
                <Route index element={<ProductList />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="profile" element={<Profile />} />
                <Route path="carrito" element={<Carrito/>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
