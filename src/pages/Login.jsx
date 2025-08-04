import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useState } from "react"; // ✅ agregado para manejar el mensaje de error
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null); // ✅ estado para errores

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
  setErrorMessage(null);
  console.log("Login.jsx: Intentando iniciar sesión para usuario:", data.email);

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: data.email,
        contraseña: data.password
      }),
    });

    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      console.error("Login.jsx: Error de respuesta del servidor:", response.status, result);
      setErrorMessage(result.message || "Error al iniciar sesión. Inténtalo de nuevo.");
      return;
    }

    console.log("Login.jsx: Login exitoso. Datos recibidos:", result);
    login(result.token, result.cliente);
    navigate("/dashboard");
  } catch (error) {
    console.error("Login.jsx: Error de red o del servidor:", error);
    setErrorMessage("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
  }
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email es requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Formato de email no válido",
                },
              })}
              placeholder="Ej: mail@mail.com"
              className="form-input"
              autoComplete="email"
            />
            {errors.email && <div className="error-message">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password es requerido",
              })}
              placeholder="Password"
              className="form-input"
              autoComplete="current-password"
            />
            {errors.password && <div className="error-message">{errors.password.message}</div>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" {...register("remember")} />
              <span>Recordarme</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              ¿Olvidó su contraseña?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>

          {errorMessage && (
            <div className="error-message" style={{ marginTop: "1rem" }}>
              {errorMessage}
            </div>
          )}
        </form>

        <div className="login-footer">
          <p>
            ¿No tiene una cuenta?{" "}
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