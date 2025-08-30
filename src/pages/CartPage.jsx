import { useCart } from "../hooks/useCart";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import './CartPage.css';

const CartPage = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();
  const { distribuidor } = useContext(AuthContext);
  //console.log("Distribuidor en CartPage:", distribuidor);

  // Obtener el valor de entrega del distribuidor (0 si no hay distribuidor)
  const valorEntrega = distribuidor?.valorEntrega || 0;
  const totalConEnvio = cartTotal + valorEntrega;

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
          {cartItemCount === 0 ? (
            <div className="empty-cart-message">
              <p>Tu carrito está vacío</p>
              <button 
                className="continue-shopping-btn"
                onClick={onClose}
              >
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
                  onClick={() => {
                    // Aquí puedes incluir el valorEntrega en los datos del pago
                    const datosPago = {
                      productos: cart,
                      subtotal: cartTotal,
                      envio: valorEntrega,
                      total: totalConEnvio,
                      distribuidorId: distribuidor?.id
                    };
                    console.log('Datos para el pago:', datosPago);
                    // Aquí iría la lógica para procesar el pago
                  }}
                >
                  Proceder al pago
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