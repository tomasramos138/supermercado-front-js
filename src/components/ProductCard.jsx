import { useCart } from "../hooks/useCart";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  return (
    <div style={cardStyles.card}>
      <img
        src={product.imagen && product.imagen.trim() !== "" 
          ? product.imagen 
          : 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=774&auto=format&fit=crop'}
        alt={product.name}
        style={cardStyles.image}
      />
      <h3 style={cardStyles.title}>{product.name}</h3>
      <p style={cardStyles.description}>{product.descripcion}</p>
      <div style={cardStyles.price}>
        ${product.precio ? product.precio.toFixed(2) : 'N/A'}
      </div>
      <div style={cardStyles.stock}>
        Stock disponible: {availableStock}
      </div>
      <button 
        style={cardStyles.button}
        onClick={() => addToCart(product)}
        disabled={availableStock <= 0}
      >
        {availableStock <= 0 ? 'Agotado' : 'Añadir al carrito'}
      </button>
    </div>
  );
}

const cardStyles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    margin: '15px',
    width: '250px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease-in-out',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '15px',
    textAlign: 'center',
    flexGrow: 1,
  },
  price: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '10px',
  },
  stock: {
    fontSize: '0.8em',
    color: '#666',
    marginBottom: '10px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.2s ease-in-out',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  }
};

export default ProductCard;