import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../services/api";

const PagoForm = () => {
 const [title, setTitle] = useState("");
 const [quantity, setQuantity] = useState(1);
 const [price, setPrice] = useState(0);
 const [initPoint, setInitPoint] = useState("");


 const handleSubmit = async (e) => {
   e.preventDefault();


   try {
     const res = await axios.post(`${API_URL}/api/mercadopago/create-preference`, {
       title,
       quantity,
       price,
     });


     setInitPoint(res.data.init_point);
   } catch (error) {
     console.error("Error creando preferencia:", error);
     alert("No se pudo crear la preferencia");
   }
 };


 return (
   <div style={{ padding: "20px" }}>
     <h2>Formulario de pago</h2>


     <form onSubmit={handleSubmit}>
       <div>
         <label>Producto:</label>
         <input
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           required
         />
       </div>


       <div>
         <label>Cantidad:</label>
         <input
           type="number"
           value={quantity}
           onChange={(e) => setQuantity(Number(e.target.value))}
           min={1}
           required
         />
       </div>


       <div>
         <label>Precio:</label>
         <input
           type="number"
           value={price}
           onChange={(e) => setPrice(Number(e.target.value))}
           min={1}
           required
         />
       </div>


       <button type="submit">Pagar con Mercado Pago</button>
     </form>


     {initPoint && (
       <div style={{ marginTop: "20px" }}>
         <a href={initPoint} target="_blank" rel="noreferrer">
           Ir a Mercado Pago
         </a>
       </div>
     )}
   </div>
 );
};


export default PagoForm;


