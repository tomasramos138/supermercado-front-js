import { useContext, useState } from "react";
import { useCart } from "../hooks/useCart";
import { AuthContext } from "../contexts/auth"; // Asegúrate de que la ruta a tu contexto sea correcta
import './CartPage.css';

const CartPage = ({ isOpen, onClose }) => {
  // 1. OBTENER DATOS DE LOS HOOKS
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount, clearCart } = useCart();
  const { user, distribuidor } = useContext(AuthContext);

  // 2. ESTADOS PARA MANEJAR LA INTERFAZ
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  // 3. CÁLCULOS
  const valorEntrega = distribuidor?.valorEntrega || 0;
  const totalConEnvio = cartTotal + valorEntrega;

  // 4. FUNCIÓN PARA PROCESAR LA COMPRA
  const handleProcesarCompra = async () => {
    setIsLoading(true);
    setError(null);
    setMensajeExito(null);

    // Validaciones iniciales en el frontend
    if (!user) {
      setError("Debes iniciar sesión para realizar una compra.");
      setIsLoading(false);
      return;
    }
    
    if (cartItemCount === 0) {
      setError("Tu carrito está vacío.");
      setIsLoading(false);
      return;
    }

    try {
      // --- PASO 1: VERIFICAR STOCK EN EL BACKEND ---
      const itemsParaVerificar = cart.map(item => ({
        productoId: item.id,
        cantidad: item.quantity,
      }));

      const resStock = await fetch("http://localhost:3000/api/venta/verificar-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsParaVerificar }),
      });

      if (!resStock.ok) {
        const errorData = await resStock.json();
        throw new Error(errorData.message || "Error al verificar el stock.");
      }

      // --- PASO 2: CREAR LA VENTA ---
      const resVenta = await fetch("http://localhost:3000/api/venta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: new Date().toISOString(),
          total: 0, // El total se actualizará al final
          cliente: user.id,
          distribuidor: distribuidor?.id,
        }),
      });

      if (!resVenta.ok) {
        throw new Error("No se pudo crear el registro de la venta.");
      }

      const ventaCreada = await resVenta.json();
      const ventaId = ventaCreada.data.id;

      // --- PASO 3: CREAR LOS ITEMS DE VENTA ---
      const promesasItems = cart.map(item =>
        fetch("http://localhost:3000/api/item-venta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cantidad: item.quantity,
            producto: item.id,
            venta: ventaId,
          }),
        }).then(res => {
          if (!res.ok) throw new Error(`Error al procesar el producto: ${item.name}`);
          return res.json();
        })
      );

      const itemsCreados = await Promise.all(promesasItems);

      // --- PASO 4: ACTUALIZAR EL TOTAL DE LA VENTA ---
      const totalFinal = itemsCreados.reduce((total, item) => total + item.data.subtotal, 0);

      await fetch(`http://localhost:3000/api/venta/${ventaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: totalFinal }),
      });

      setMensajeExito("¡Compra realizada con éxito! Gracias por elegirnos.");
      clearCart(); // Limpiamos el carrito

      // Opcional: Cierra el carrito después de 3 segundos
      setTimeout(() => {
        onClose();
        setMensajeExito(null);
      }, 3000);

    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado al procesar la compra.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      
      <div className="cart-slider">
        <div className="cart-header">
          <h2>Tu Carrito ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">
            &times;
          </button>
        </div>

        <div className="cart-content">
          {error && <div className="alert alert-danger mx-3">{error}</div>}
          
          {cartItemCount === 0 ? (
            <div className="empty-cart-message">
              <p>{mensajeExito ? mensajeExito : "Tu carrito está vacío"}</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.descripcion}</p>
                      
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn minus"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn plus"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                        <span className="stock-info">
                          {item.quantity >= item.stock ? 'Máximo' : `Stock: ${item.stock}`}
                        </span>
                      </div>
                      
                      <div className="item-price">
                        ${(item.precio * item.quantity).toFixed(2)}
                        <span className="unit-price">(${item.precio.toFixed(2)} c/u)</span>
                      </div>
                    </div>
                    
                    <button
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}):</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>
                    {valorEntrega > 0 ? `$${valorEntrega.toFixed(2)}` : 'Gratis'}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${totalConEnvio.toFixed(2)}</span>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={handleProcesarCompra} // Cambiado para llamar a la nueva función
                  disabled={isLoading || cartItemCount === 0}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    "Proceder al pago"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;