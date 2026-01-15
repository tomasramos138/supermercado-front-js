import { useContext, useState } from "react";
import { useCart } from "../hooks/useCart";
import { AuthContext } from "../contexts/auth";
import useProducts from "../hooks/useProducts";
import useMercadoPago from "../hooks/usemercadoPago";
import "./CartPage.css";

const CartPage = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();
  const { distribuidor, user } = useContext(AuthContext);
  const { refetchProducts } = useProducts();
  const { createPreference } = useMercadoPago();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const valorEntrega = distribuidor?.valorEntrega || 0;
  const totalConEnvio = cartTotal + valorEntrega;

  const handleMercadoPago = async () => {
  // Asegurar que cart es un array
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    setError("El carrito está vacío");
    return;
  }

  // VERIFICAR que el usuario esté logueado
  if (!user || !user.id) {
    setError("Debes iniciar sesión para realizar una compra");
    return;
  }

  // VERIFICAR que hay distribuidor seleccionado
  if (!distribuidor || !distribuidor.id) {
    setError("No hay distribuidor seleccionado");
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    // PREPARAR los datos COMPLETOS que espera el backend
    const payload = {
      items: cart.map(item => ({
        id: item.id, // ¡IMPORTANTE! El backend necesita el ID del producto
        name: item.name,
        quantity: Number(item.quantity),
        precio: Number(item.precio),
      })),
      clienteId: Number(user.id), // Convertir a número
      distribuidorId: Number(distribuidor.id), // Convertir a número
    };

    console.log("Enviando datos al backend:", payload);

    // LLAMAR al backend con los datos COMPLETOS
    const response = await createPreference(payload);

    // Verificar la respuesta
    if (response?.init_point) {
      console.log("Preferencia creada, venta ID:", response.ventaId);
      
      // Guardar info de la venta
      sessionStorage.setItem('ventaPendiente', JSON.stringify({
        ventaId: response.ventaId,
        timestamp: new Date().toISOString()
      }));

      // Redirigir a MercadoPago
      window.location.href = response.init_point;
    } else {
      throw new Error(response?.error || "No se recibió un enlace de pago válido");
    }
  } catch (err) {
    console.error("Error en handleMercadoPago:", err);
    
    // Manejo específico de errores
    if (err.message.includes("stock_insuficiente") || err.message.includes("Stock")) {
      setError("Algunos productos no tienen stock suficiente");
      await refetchProducts();
    } else if (err.message.includes("cliente")) {
      setError("Debes iniciar sesión para comprar");
    } else if (err.message.includes("distribuidor")) {
      setError("Selecciona un distribuidor para continuar");
    } else {
      setError(err.message || "Error al procesar la compra");
    }
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
