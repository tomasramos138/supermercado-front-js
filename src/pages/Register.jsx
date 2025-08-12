import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useZonas from "../hooks/useZonas";
import "./Register.css";

const Register = () => {
  const { registerUser, errorLogin } = useAuth();
  const { zonas, isLoading } = useZonas();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    const datosFormulario = {
      ...data,
      zonaId: Number(data.zona),
    };

    const result = await registerUser(datosFormulario);
    if (!result?.success) return; // Si hay error, no navega
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Complete sus datos para registrarse</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              className="form-input"
              {...register("name", { required: "El nombre es requerido" })}
              placeholder="Nombre"
            />
            {errors.name && <div className="error-message">{errors.name.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              className="form-input"
              {...register("apellido", { required: "El apellido es requerido" })}
              placeholder="Apellido"
            />
            {errors.apellido && <div className="error-message">{errors.apellido.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              id="dni"
              className="form-input"
              {...register("dni", { required: "El DNI es requerido" })}
              placeholder="DNI"
            />
            {errors.dni && <div className="error-message">{errors.dni.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="usuario">Email</label>
            <input
              id="usuario"
              type="email"
              className="form-input"
              {...register("usuario", {
                required: "El usuario (email) es requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Formato de email no válido",
                },
              })}
              placeholder="Email"
              autoComplete="username"
            />
            {errors.usuario && <div className="error-message">{errors.usuario.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              id="contraseña"
              type="password"
              className="form-input"
              {...register("contraseña", { required: "La contraseña es requerida" })}
              placeholder="Contraseña"
              autoComplete="new-password"
            />
            {errors.contraseña && <div className="error-message">{errors.contraseña.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="zona">Zona</label>
            <select
              id="zona"
              className="form-input"
              {...register("zona", { required: "Debe seleccionar una zona" })}
            >
              <option value="">Seleccionar zona</option>
              {isLoading ? (
                <option disabled>Cargando zonas...</option>
              ) : (
                zonas?.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} - {z.description}
                  </option>
                ))
              )}
            </select>
            {errors.zona && <div className="error-message">{errors.zona.message}</div>}
          </div>

          <button className="register-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>

          {errorLogin && <div className="error-message">{errorLogin}</div>}
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login" className="login-link">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;