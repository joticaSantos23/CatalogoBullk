import Usuario from "../auth/auth.model.js";

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  return await Usuario.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findById(id).select("-password");
};

// Actualizar usuario
export const actualizarUsuario = async (id, datos) => {
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    return null;
  }

  // Evitar modificar la contraseña desde este endpoint
  const datosActualizados = {
    nombre: datos.nombre,
    email: datos.email,
    rol: datos.rol,
    activo: datos.activo,
  };

  // Evitar que el sistema quede sin administradores
  if (
    usuario.rol === "admin" &&
    (datos.rol === "usuario" || datos.activo === false)
  ) {
    const cantidadAdministradores = await Usuario.countDocuments({
      rol: "admin",
      activo: true,
      _id: { $ne: usuario._id },
    });

    if (cantidadAdministradores === 0) {
      throw new Error(
        "No se puede modificar al último administrador activo"
      );
    }
  }

  return await Usuario.findByIdAndUpdate(
    id,
    datosActualizados,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    return null;
  }

  // Evitar eliminar al último administrador activo
  if (usuario.rol === "admin" && usuario.activo) {
    const cantidadAdministradores = await Usuario.countDocuments({
      rol: "admin",
      activo: true,
      _id: { $ne: usuario._id },
    });

    if (cantidadAdministradores === 0) {
      throw new Error(
        "No se puede eliminar al último administrador activo"
      );
    }
  }

  return await Usuario.findByIdAndDelete(id);
};