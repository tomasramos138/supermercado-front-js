import { useContext, useState } from "react";
import { useCart } from "../hooks/useCart";
import { AuthContext } from "../contexts/auth";
import useProducts from "../hooks/useProducts";
import useMercadoPago from "../hooks/usemercadoPago";
import "./CartPage.css";

const CartPage = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount, clearCart } = useCart();
  const { distribuidor } = useContext(AuthContext);
  const { refetchProducts } = useProducts();
  const { createPreference } = useMercadoPago();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const valorEntrega = distribuidor?.valorEntrega || 0;
  const totalConEnvio = cartTotal + valorEntrega;

  const handleMercadoPago = async () => {
    if (!cart || cart.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const preference = await createPreference(cart);

      if (preference?.init_point) {
        window.location.href = preference.init_point; // Redirige al checkout
        clearCart();
        await refetchProducts();
      } else {
        throw new Error("No se recibió un enlace de pago válido.");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error al crear la preferencia de pago.");
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
          <h2>
            Tu Carrito ({cartItemCount} {cartItemCount === 1 ? "item" : "items"})
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">
            &times;
          </button>
        </div>

        <div className="cart-content">
          {error && <div className="alert alert-danger mx-3">{error}</div>}

          {cartItemCount === 0 ? (
            <div className="empty-cart-message">
              <p>Tu carrito está vacío</p>
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
                      src={item.imagen || "https://via.placeholder.com/80"}
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
                          {item.quantity >= item.stock ? "Máximo" : `Stock: ${item.stock}`}
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
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>{valorEntrega > 0 ? `$${valorEntrega.toFixed(2)}` : "Gratis"}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${totalConEnvio.toFixed(2)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handleMercadoPago}
                  disabled={isLoading || cartItemCount === 0}
                >
                  {isLoading ? "Procesando..." : "Proceder al pago"}
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
