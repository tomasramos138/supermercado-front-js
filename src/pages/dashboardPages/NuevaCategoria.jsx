import React, { useState } from "react";
import useCategoria from "../../hooks/useCategoria";
import "./NuevaCategoria.css"; // 👈 Importar estilos


function NuevaCategoria() {
 const { categorias, isLoading, createCategoria } = useCategoria();


 const [name, setName] = useState("");
 const [description, setDescription] = useState("");


 const handleSubmit = async (e) => {
   e.preventDefault();
   await createCategoria({ name, description });
   setName("");
   setDescription("");
 };


 if (isLoading) return <p>Cargando categorías...</p>;


 return (
   <div className="categorias-container">
     <h2 className="categorias-title">Categorías</h2>


     <div className="categorias-list">
       {categorias?.map((cat) => (
         <div key={cat.id} className="categoria-card">
           <div className="categoria-nombre">
             {cat.name}
           </div>
           <div className="categoria-descripcion">
             {cat.description}
           </div>
         </div>
       ))}
     </div>


     <div className="nueva-categoria">
       <h3 className="nueva-categoria-title">Nueva Categoría</h3>
       <form className="form-categoria" onSubmit={handleSubmit}>
         <input
           type="text"
           placeholder="Nombre"
           value={name}
           onChange={(e) => setName(e.target.value)}
           required
         />
         <input
           type="text"
           placeholder="Descripción"
           value={description}
           onChange={(e) => setDescription(e.target.value)}
         />
         <button type="submit">Crear</button>
       </form>
     </div>
   </div>
 );
}


export default NuevaCategoria;