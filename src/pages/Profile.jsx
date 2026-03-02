import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./Profile.css";
import useZonas from "../hooks/useZonas";
import useClientes from "../hooks/useCliente";
import { useState } from "react";


const Profile = () => {
 const { user, logout } = useAuth();
 const { zonas } = useZonas();
 const { updateClient } = useClientes();
 const [editMode, setEditMode] = useState(false);
 const [activeSection, setActiveSection] = useState("personal");


 const mockProfile = {
   id: user?.id,
   name: user?.name || "",
   lastName: user?.apellido || "",
   usuario: user?.usuario || "",
   role: user?.rol ||"Usuario",
   zone: user?.zona?.id || "",
   avatar: "👤",
 };


 const {
   register,
   handleSubmit,
   watch,
   formState: { errors, isSubmitting },
   reset,
 } = useForm({
   defaultValues: {
     name: mockProfile.name,
     apellido: mockProfile.lastName,
     usuario: mockProfile.usuario,
     contraseña: "",
     confirmPassword: "",
     zona: mockProfile.zone,
   },
 });


 const onSubmit = async (data) => {
   const currentValues = {
     name: data.name,
     apellido: data.apellido,
     usuario: data.usuario,
     contraseña: data.contraseña,
     zona: data.zona
   };


   const originalValues = {
     name: mockProfile.name,
     apellido: mockProfile.lastName,
     usuario: mockProfile.usuario,
     contraseña: "",
     zona: mockProfile.zone
   };


   const cambios = {};
  
   Object.keys(currentValues).forEach(key => {
     const currentValue = currentValues[key];
     const originalValue = originalValues[key];
    
     if (key === 'contraseña') {
       if (currentValue && currentValue.trim() !== '') {
         cambios[key] = currentValue;
       }
     }
     else if (currentValue !== originalValue) {
       cambios[key] = currentValue;
     }
   });


   if (Object.keys(cambios).length === 0) {
     alert("No se detectaron cambios para guardar.");
     setEditMode(false);
     return;
   }


   try {
     await updateClient({
       id: mockProfile.id,
       ...cambios,
     });
    
     reset({
       ...data,
       contraseña: "",
       confirmPassword: ""
     });
    
     setEditMode(false);
     alert("Los cambios se guardaron con éxito.\nSu sesión se cerrará y deberá volver a iniciar sesión.");
     logout();
   } catch (error) {
     console.error('Error en el componente:', error);
   }
 };


 const handleCancel = () => {
   reset();
   setEditMode(false);
 };


 const renderPersonalInfo = () => (
   <div className="form-section">
     <h4>Información Básica</h4>
    
     <div className="form-row">
       <div className="form-group">
         <label htmlFor="name">Nombre</label>
         <input
           type="text"
           id="name"
           {...register("name", editMode ? { required: "El nombre es requerido" } : {})}
           className="form-input"
           disabled={!editMode}
         />
         {errors.name && (
           <div className="error-message">{errors.name.message}</div>
         )}
       </div>


       <div className="form-group">
         <label htmlFor="apellido">Apellido</label>
         <input
           type="text"
           id="apellido"
           {...register("apellido", editMode ? { required: "El apellido es requerido" } : {})}
           className="form-input"
           disabled={!editMode}
         />
         {errors.apellido && (
           <div className="error-message">{errors.apellido.message}</div>
         )}
       </div>
     </div>


     <div className="form-group">
       <label htmlFor="usuario">Email</label>
       <input
         type="email"
         id="usuario"
         {...register("usuario", editMode ? {
           required: "El email es requerido",
           pattern: {
             value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
             message: "Email no válido",
           },
         } : {})}
         className="form-input"
         disabled={!editMode}
       />
       {errors.usuario && (
         <div className="error-message">{errors.usuario.message}</div>
       )}
     </div>


     <div className="form-group">
       <label htmlFor="zona">Zona</label>
       <select
         id="zona"
         {...register("zona", editMode ? { required: "Debe seleccionar una zona" } : {})}
         className="form-input"
         disabled={!editMode}
       >
        
         {zonas?.map((zona) => (
           <option key={zona.id} value={zona.id}>
             {zona.name}
           </option>
         ))}
       </select>
       {errors.zona && (
         <div className="error-message">{errors.zona.message}</div>
       )}
     </div>
   </div>
 );


 const renderSecurityInfo = () => (
   <div className="form-section">
     <h4>Seguridad</h4>
     <div className="password-note">
       <p>⚠️ <strong>Importante:</strong> Dejar en blanco si no desea cambiar la contraseña</p>
     </div>
    
     <div className="form-row">
       <div className="form-group">
         <label htmlFor="contraseña">Nueva Contraseña</label>
         <input
           type="password"
           id="contraseña"
           {...register("contraseña", editMode ? {
             minLength: {
               value: 6,
               message: "La contraseña debe tener al menos 6 caracteres",
             },
           } : {})}
           className="form-input"
           disabled={!editMode}
           placeholder="Dejar en blanco para no cambiar"
         />
         {errors.contraseña && (
           <div className="error-message">{errors.contraseña.message}</div>
         )}
       </div>


       <div className="form-group">
         <label htmlFor="confirmPassword">Confirmar Contraseña</label>
         <input
           type="password"
           id="confirmPassword"
           {...register("confirmPassword", editMode ? {
             validate: (value) => {
               const password = watch("contraseña");
               if (password && value !== password) {
                 return "Las contraseñas no coinciden";
               }
               return true;
             }
           } : {})}
           className="form-input"
           disabled={!editMode}
           placeholder="Confirmar nueva contraseña"
         />
         {errors.confirmPassword && (
           <div className="error-message">
             {errors.confirmPassword.message}
           </div>
         )}
       </div>
     </div>
   </div>
 );


 return (
   <div className="profile-page">
     <div className="profile-header">
       <h1>Perfil</h1>
       <p>Administrar la información personal de su cuenta</p>
     </div>
    
     <div className="profile-content">
       <div className="profile-card">
         <div className="profile-avatar">
           <span className="avatar">{mockProfile.avatar}</span>
         </div>
         <div className="profile-info">
           <h2>
             {mockProfile.name} {mockProfile.lastName}
           </h2>
           <p className="profile-role">Rol: {mockProfile.role}</p>
           <p className="profile-zone">
             Ubicación:{" "}
             {zonas?.find((z) => z.id === mockProfile.zone)?.name ||
               "Sin zona asignada"}
           </p>
           <div className="profile-details">
             <div className="detail-item">
               <label>Email:</label>
               <span>{mockProfile.usuario}</span>
             </div>
           </div>
         </div>
        
         <div className="profile-actions">
           {!editMode ? (
             <button
               className="edit-btn"
               onClick={() => setEditMode(true)}
             >
               Editar Perfil
             </button>
           ) : (
             <div className="edit-actions">
               <button
                 className="cancel-btn"
                 onClick={handleCancel}
               >
                 Cancelar
               </button>
               <button
                 className="save-btn"
                 onClick={handleSubmit(onSubmit)}
                 disabled={isSubmitting}
               >
                 {isSubmitting ? "Guardando..." : "Guardar Cambios"}
               </button>
             </div>
           )}
         </div>
       </div>


       <div className="profile-sections">
         <div className="section-card">
           <div className="section-tabs">
             <button
               className={`tab ${activeSection === 'personal' ? 'active' : ''}`}
               onClick={() => setActiveSection('personal')}
             >
               Información Personal
             </button>
             <button
               className={`tab ${activeSection === 'security' ? 'active' : ''}`}
               onClick={() => setActiveSection('security')}
             >
               Seguridad
             </button>
           </div>


           <div className="section-content">
             {activeSection === 'personal' && renderPersonalInfo()}
             {activeSection === 'security' && renderSecurityInfo()}
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};


export default Profile;
