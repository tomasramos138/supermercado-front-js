import { useState, useEffect, useContext } from "react";
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/auth';

export function CartProvider({ children }) {
    //recupera el carrito del localStorage o inicia uno vacío
    const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { user } = useContext(AuthContext);

    // Limpiar el carrito cuando el usuario cambie
  useEffect(() => {
  if (!user) {
    setCart([]);
    localStorage.removeItem("cart");
  }
}, [user]); 
  // Guarda cada cambio del carrito en el localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(item => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`No hay suficiente stock. Solo quedan ${product.stock} unidades.`);
          return currentCart;
        }
        return currentCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        if (product.stock <= 0) {
          alert('Este producto está agotado');
          return currentCart;
        }
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => 
      currentCart.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((currentCart) => {
      const product = currentCart.find(item => item.id === productId);
      if (!product) return currentCart;

      if (newQuantity > product.stock) {
        alert(`No puedes agregar más de ${product.stock} unidades de este producto.`);
        return currentCart;
      }

      if (newQuantity < 1) {
        return currentCart.filter(item => item.id !== productId);
      }

      return currentCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      );
    });
  };
//Limpiar el carrito luego de confirmar la compra
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.precio * item.quantity), 
    0
  );

  const cartItemCount = cart.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  const cartValue = {
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    cartTotal,
    cartItemCount,
    clearCart
  };

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  );
}