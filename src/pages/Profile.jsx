import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  
  const mockProfile = {
    name: user?.name || "",
    lastName: user?.apellido || "",
    email: user?.usuario || "",
    role: user?.rol === true ? "Administrador" : "Cliente",
    zone: user?.zona?.name || "Sin zona asignada",
    avatar: "👤",
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: mockProfile.name,
      apellido: mockProfile.lastName,
      email: mockProfile.email,
    },
  });

  const onSubmit = async (data) => {
    console.log("Datos del formulario enviados:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        reset(data);
        resolve();
      }, 1000);
    });
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
            <h2>{mockProfile.name} {mockProfile.lastName}</h2>
            <p className="profile-role">Rol: {mockProfile.role}</p>
            <p className="profile-zone">Zona: {mockProfile.zone}</p>
            <div className="profile-details">
              <div className="detail-item">
                <label>Email:</label>
                <span>{mockProfile.email}</span>
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
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  {...register("apellido", { required: "El apellido es requerido" })}
                  className="form-input"
                />
                {errors.apellido && (
                  <div className="error-message">{errors.apellido.message}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Email no válido",
                    },
                  })}
                  className="form-input"
                />
                {errors.email && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </div>
              <button
                type="submit"
                className="save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;