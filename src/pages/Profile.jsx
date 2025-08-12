import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  // Asegúrate de que tu objeto 'user' tenga 'name' y 'apellido'
  // Si 'user.name' ya es el nombre completo, puedes ajustar esto.
  // Asumo que 'user.name' es el nombre y 'user.apellido' es el apellido.
  const mockProfile = {
    name: user?.name || "",
    lastName: user?.apellido || "", // Asumo que el apellido viene en user.apellido
    email: user?.usuario || "", // Asumo que el email viene en user.usuario
    role: user?.rol === true ? "Administrador" : "Cliente",
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
      apellido: mockProfile.lastName, // Asigna el apellido aquí
      email: mockProfile.email,
      // Eliminamos 'phone' de los defaultValues
    },
  });

  const onSubmit = async (data) => {
    console.log("Datos del formulario enviados:", data);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aquí actualizarías el perfil del usuario en tu backend
        // Por ahora, solo reseteamos el formulario
        reset(data); // Resetea con los datos enviados para mantenerlos en el formulario
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Perfil</h1>
        <p>Administrar la configuración y preferencias de su cuenta</p>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar">{mockProfile.avatar}</span>
          </div>
          <div className="profile-info">
            <h2>{mockProfile.name} {mockProfile.lastName}</h2> {/* Muestra nombre y apellido */}
            <p className="profile-role">{mockProfile.role}</p>
            <div className="profile-details">
              <div className="detail-item">
                <label>Email:</label>
                <span>{mockProfile.email}</span>
              </div>
              {/* Eliminamos "Registrado" y "Ultimo login" */}
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
                <label htmlFor="apellido">Apellido</label> {/* Cambiado a 'apellido' */}
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
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Expresión regular para validar formato de email
                      message: "Email no válido",
                    },
                  })}
                  className="form-input"
                />
                {errors.email && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </div>
              {/* Eliminamos el campo de Teléfono */}
              <button
                type="submit"
                className="save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
          <div className="section-card">
            <h3>Configuraciones de seguridad</h3>
            <div className="security-options">
              <div className="security-item">
                <div className="security-info">
                  <h4>Cambiar password</h4>
                  <p>Actualiza la password de su cuenta</p>
                </div>
                <button className="security-btn">Cambiar</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Autenticación por doble factor</h4>
                  <p>Agrega un nivel extra de seguridad</p>
                </div>
                <button className="security-btn">Habilitar</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Historial</h4>
                  <p>Ver su actividad reciente</p>
                </div>
                <button className="security-btn">Ver</button>
              </div>
            </div>
          </div>
          <div className="section-card">
            <h3>Preferencias</h3>
            <div className="preferences">
              <div className="preference-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Notificaciones por email</span>
                </label>
              </div>
              <div className="preference-item">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Notificaciones push</span>
                </label>
              </div>
              <div className="preference-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Reportes semanales</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;