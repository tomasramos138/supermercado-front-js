import { useContext, useState } from "react";
import { useCart } from "../hooks/useCart";
import  useVentas  from "../hooks/useVenta";
import { AuthContext } from "../contexts/auth";
import useProducts from "../hooks/useProducts";
import './CartPage.css';

const CartPage = ({ isOpen, onClose }) => {
  // 1. OBTENER DATOS DE LOS HOOKS
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount, clearCart } = useCart();
  const { user, distribuidor } = useContext(AuthContext);
  const { procesarCompra } = useVentas();

  // 2. ESTADOS PARA MANEJAR LA INTERFAZ
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { refetchProducts } = useProducts(); //funcion para refrezcar el stock de los productos luego de la venta
  // 3. CÁLCULOS
  const valorEntrega = distribuidor?.valorEntrega || 0;
  const totalConEnvio = cartTotal + valorEntrega;

  // 4. FUNCIÓN PARA MOSTRAR CONFIRMACIÓN
  const handleMostrarConfirmacion = () => {
    setShowConfirmation(true);
  };

  // 5. FUNCIÓN PARA CANCELAR CONFIRMACIÓN
  const handleCancelarConfirmacion = () => {
    setShowConfirmation(false);
    setError(null);
  };

  // 6. FUNCIÓN PARA PROCESAR LA COMPRA (CONFIRMADA)
  const handleProcesarCompraConfirmada = async () => {
    setIsLoading(true);
    setError(null);
    setShowConfirmation(false);

    try {
      // Preparar datos para la compra
      const itemsParaCompra = cart.map(item => ({
        productoId: item.id,
        cantidad: item.quantity,
      }));

      // Procesar toda la compra usando el hook
      await procesarCompra({
        items: itemsParaCompra,
        cliente: user.id,
        distribuidor: distribuidor?.id,
      });

      setMensajeExito("¡Compra realizada con éxito! Gracias por elegirnos.");
      
      // LIMPIAR CARRITO INMEDIATAMENTE después de compra exitosa
      clearCart();

      // Refrescar productos para actualizar stock
      await refetchProducts();

      // Cerrar el carrito después de 3 segundos
      setTimeout(() => {
        onClose();
        setMensajeExito(null);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Ocurrió un error inesperado al procesar la compra.");
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
                  onClick={handleMostrarConfirmacion} // ← Ahora muestra confirmación
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

        {/* MODAL DE CONFIRMACIÓN */}
        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-modal">
              <div className="confirmation-header">
                <h3>Confirmar Compra</h3>
              </div>
              <div className="confirmation-body">
                <p>¿Estás seguro de que deseas proceder con la compra?</p>
                <div className="confirmation-details">
                  <p><strong>Total a pagar:</strong> ${totalConEnvio.toFixed(2)}</p>
                  <p><strong>Productos:</strong> {cartItemCount}</p>
                  <p><strong>Envío:</strong> {valorEntrega > 0 ? `$${valorEntrega.toFixed(2)}` : 'Gratis'}</p>
                </div>
              </div>
              <div className="confirmation-actions">
                <button 
                  className="btn-cancel"
                  onClick={handleCancelarConfirmacion}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirm"
                  onClick={handleProcesarCompraConfirmada}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Compra"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;