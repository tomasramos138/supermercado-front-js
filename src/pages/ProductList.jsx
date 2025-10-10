import { useState } from "react";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import "./ProductList.css";

function ProductList() {
  const { isLoading, isError, error, products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtrar productos con stock mayor a 0
  const productsActivos = products?.filter(product => product.estado===true) || [];

  //Recorre los productos y obtiene las categorias sin repetir, si no hay productos, devuelve un array vacio
  const categoriasUnicas = ["all",...new Set(productsActivos?.map(p => p.categoria.name) || [])]; 
  //console.log(categoriasUnicas);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory === "all" 
    ? productsActivos 
    : productsActivos.filter(product => product.categoria.name === selectedCategory);

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

  if (productsActivos.length === 0) {
    return (
      <div className="container-centered">
        <p className="message">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">Nuestros Productos</h1>
      
      {/* Selector de categorías */}
      <div className="category-filter">
        <label htmlFor="category-select" className="filter-label">
          Filtrar por categoría:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categoriasUnicas.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "Todas las categorías" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar mensaje si no hay productos en la categoría seleccionada */}
      {filteredProducts.length === 0 && selectedCategory !== "all" && (
        <div className="container-centered">
          <p className="message">No hay productos en la categoría seleccionada.</p>
        </div>
      )}

      <div className="grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;