import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import useCategoria from "../hooks/useCategoria";
import "./ProductList.css";

function ProductList() {
  const { isLoading, isError, error, products, searchProductsByName, searchProductsByCategoria } = useProducts();
  const { categorias } = useCategoria();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    const productsActivos = products?.filter(product => product.estado === true) || [];
    setDisplayedProducts(productsActivos);
  }, [products]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      const productsActivos = products?.filter(product => product.estado === true) || [];
      setDisplayedProducts(productsActivos);
    } else {
      try {
        const result = await searchProductsByName(term);
        const filteredResult = result?.filter(product => product.estado === true) || [];
        setDisplayedProducts(filteredResult);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setDisplayedProducts([]);
      }
    }
  };

  const handleCategorySearch = async (categoryId) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === "all") {
      const productsActivos = products?.filter(product => product.estado === true) || [];
      setDisplayedProducts(productsActivos);
    } else {
      try {
        const result = await searchProductsByCategoria(categoryId);
        console.log("Resultados por categoría:", result);
        const filteredResult = result?.filter(product => product.estado === true) || [];
        setDisplayedProducts(filteredResult);
      } catch (error) {
        console.error("Error en búsqueda por categoría:", error);
        setDisplayedProducts([]);
      }
    }
  };

  const categoriasUnicas = [
    { id: "all", name: "Todas las categorías" },
    ...(categorias || [])
  ];

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

  return (
    <div className="container">
      <h1 className="header">Nuestros Productos</h1>
      
      {/* Barra de búsqueda por nombre */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Selector de categorías */}
      <div className="category-filter">
        <label htmlFor="category-select" className="filter-label">
          Filtrar por categoría:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => handleCategorySearch(e.target.value)}
          className="category-select"
        >
          {categoriasUnicas.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar mensaje si no hay productos */}
      {displayedProducts.length === 0 && (
        <div className="container-centered">
          <p className="message">
            {searchTerm || selectedCategory !== "all" 
              ? "No se encontraron productos con los filtros aplicados." 
              : "No se encontraron productos."
            }
          </p>
        </div>
      )}

      <div className="grid">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
