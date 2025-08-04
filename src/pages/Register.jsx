import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useZonas from "../hooks/useZonas";
import { useAuth } from "../hooks/useAuth";
import "./Register.css";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { zonas, isLoading } = useZonas();

  console.log("Zonas cargadas:", zonas);

  const onSubmit = async (data) => {
    try {
    // Convertimos zona a número explícitamente
    const datosFormulario = {
        ...data,
        zonaId: Number(data.zona),
        // Si usás roles, descomentá esto:
        // rol: false,
    };

    console.log("Datos del formulario corregidos:", datosFormulario);

    await axios.post("http://localhost:3000/api/auth/register", datosFormulario);

    alert("Registro exitoso. Ahora inicia sesión.");
    navigate("/login");

    } catch (error) {
    console.error("Error al registrar:", error);
    alert("Error al registrar usuario");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h2>Crear Cuenta</h2>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input className="form-input" {...register("name", { required: true })} placeholder="Nombre" />
            {errors.name && <span className="error-message">El nombre es requerido</span>}
          </div>

          <div className="form-group">
            <input className="form-input" {...register("apellido", { required: true })} placeholder="Apellido" />
            {errors.apellido && <span className="error-message">El apellido es requerido</span>}
          </div>

          <div className="form-group">
            <input className="form-input" {...register("dni", { required: true })} placeholder="DNI" />
            {errors.dni && <span className="error-message">El DNI es requerido</span>}
          </div>

          <div className="form-group">
            <input className="form-input" {...register("usuario", { required: true })} placeholder="Email" type="email" />
            {errors.usuario && <span className="error-message">El email es requerido</span>}
          </div>

          <div className="form-group">
            <input className="form-input" {...register("contraseña", { required: true })} placeholder="Contraseña" type="password" />
            {errors.contraseña && <span className="error-message">La contraseña es requerida</span>}
          </div>

          <div className="form-group">
            <select className="form-input" {...register("zona", { required: true })}>
              <option value="">Seleccionar zona</option>
              {isLoading ? (
                <option disabled>Cargando zonas...</option>
              ) : (
                zonas?.map(z => (
                  <option key={z.id} value={z.id}>{z.name} - {z.description}</option>
                ))
              )}
            </select>
            {errors.zona && <span className="error-message">Debe seleccionar una zona</span>}
          </div>

          <button className="register-btn" type="submit">Registrarse</button>
        </form>

        <div className="register-footer">
          ¿Ya tenés una cuenta?{" "}
          <a href="/login" className="login-link">Iniciar sesión</a>
        </div>
      </div>
    </div>
  );
};

export default Register;