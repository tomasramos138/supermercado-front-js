import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./Profile.css";
import useZonas from "../hooks/useZonas";
import useClientes from "../hooks/useCliente";

const Profile = () => {
  const { user, logout } = useAuth();
  const { zonas } = useZonas();
  const { updateClient, updateStatus } = useClientes(); // 👈 usamos updateClient

  const mockProfile = {
    id: user?.id,
    name: user?.name || "",
    lastName: user?.apellido || "",
    usuario: user?.usuario || "",
    role: user?.rol === true ? "Administrador" : "Cliente",
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

  const onSubmit = (data) => {
    const { confirmPassword, ...clienteEditado } = data; 
    updateClient({
      id: mockProfile.id,
      ...clienteEditado,
    });
    reset(data);
    alert("Los cambios se guardaron con éxito.\nSu sesión se cerrará y deberá volver a iniciar sesión.");
    logout();
  };

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
        </div>

        <div className="profile-sections">
          <div className="section-card">
            <h3>Información personal</h3>
            <form
              className="profile-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "El nombre es requerido" })}
                  className="form-input"
                />
                {errors.name && (
                  <div className="error-message">{errors.name.message}</div>
                )}
              </div>

              {/* Apellido */}
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  {...register("apellido", {
                    required: "El apellido es requerido",
                  })}
                  className="form-input"
                />
                {errors.apellido && (
                  <div className="error-message">{errors.apellido.message}</div>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="usuario">Email</label>
                <input
                  type="usuario"
                  id="usuario"
                  {...register("usuario", {
                    required: "El usuario es requerido",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Email no válido",
                    },
                  })}
                  className="form-input"
                />
                {errors.usuario && (
                  <div className="error-message">{errors.usuario.message}</div>
                )}
              </div>

              {/* Contraseña */}
              <div className="form-group">
                <label htmlFor="contraseña">Contraseña</label>
                <input
                  type="password"
                  id="contraseña"
                  {...register("contraseña", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="form-input"
                />
                {errors.contraseña && (
                  <div className="error-message">{errors.contraseña.message}</div>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Debe confirmar la contraseña",
                    validate: (value) =>
                      value === watch("contraseña") ||
                      "Las contraseñas no coinciden",
                  })}
                  className="form-input"
                />
                {errors.confirmPassword && (
                  <div className="error-message">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>

              {/* Zona */}
              <div className="form-group">
                <label htmlFor="zona">Zona</label>
                <select
                  id="zona"
                  {...register("zona", { required: "Debe seleccionar una zona" })}
                  className="form-input"
                >
                  <option value="">Seleccione una zona</option>
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

              {/* Botón */}
              <button type="submit" className="save-btn" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>

              {/* Estado del update */}
              {updateStatus.isLoading && <p>Actualizando cliente...</p>}
              {updateStatus.isError && (
                <p style={{ color: "red" }}>
                  Error: {updateStatus.error.message}
                </p>
              )}
              {updateStatus.isSuccess && (
                <p style={{ color: "green" }}>¡Cliente actualizado con éxito!</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;