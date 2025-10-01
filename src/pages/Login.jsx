import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./Login.css";

const Login = () => {
  const { login, errorLogin } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting },} = useForm({ mode: "onSubmit",});

  const onSubmit = async (data) => {
    await login(data)
    navigate("/products");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Ingrese a su cuenta para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              {...register("usuario", { required: "Usuario es requerido" })}
              placeholder="Usuario"
              className="form-input"
              autoComplete="username"
            />
            {errors.usuario && (
              <div className="error-message">{errors.usuario.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              id="contraseña"
              {...register("contraseña", { required: "Contraseña es requerida" })}
              placeholder="Contraseña"
              className="form-input"
              autoComplete="current-password"
            />
            {errors.contraseña && (
              <div className="error-message">{errors.contraseña.message}</div>
            )}
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>

          {errorLogin && <div className="error-message">{errorLogin}</div>}
        </form>

        <div className="login-footer">
          <p>
            No tiene una cuenta?{" "}
            <Link to="/register" className="register-link">
              Quiero registrarme
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;