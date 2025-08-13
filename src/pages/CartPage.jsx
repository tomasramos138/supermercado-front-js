import { useCart } from "../hooks/useCart";
import './CartPage.css'; // Asegúrate de que los estilos estén actualizados

const CartPage = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para oscurecer el fondo */}
      <div className="cart-overlay" onClick={onClose} />
      
      {/* Contenedor principal del slider */}
      <div className="cart-slider">
        {/* Encabezado del carrito */}
        <div className="cart-header">
          <h2>Tu Carrito ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">
            &times;
          </button>
        </div>

        {/* Contenido del carrito */}
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
              {/* Lista de productos */}
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
                      
                      {/* Controles de cantidad */}
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
                      
                      {/* Precio */}
                      <div className="item-price">
                        ${(item.precio * item.quantity).toFixed(2)}
                        <span className="unit-price">(${item.precio.toFixed(2)} c/u)</span>
                      </div>
                    </div>
                    
                    {/* Botón para eliminar */}
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

              {/* Resumen de compra */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}):</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={() => {
                    // Aquí puedes agregar la lógica para proceder al pago
                    console.log('Proceder al pago');
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