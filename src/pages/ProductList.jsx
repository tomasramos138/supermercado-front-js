import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import "./ProductList.css";

function ProductList() {
  const { isLoading, isError, error, products } = useProducts();

  if (isLoading) {
    return (
      <div className="container-centered">
        <p className="message">Cargando productos...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-centered">
        <p className="error-message">
          Ha ocurrido un error y no se pudieron obtener los productos: {error.message}
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-centered">
        <p className="message">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">Nuestros Productos</h1>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;