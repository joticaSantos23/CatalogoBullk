import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from "./usuario.service.js";

// Obtener todos los usuarios
export const obtenerUsuariosController = async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();

    res.json({
      cantidad: usuarios.length,
      usuarios,
    });
  } catch (error) {
    console.error(
      "Error obteniendo usuarios:",
      error.message
    );

    res.status(500).json({
      mensaje: "No se pudieron obtener los usuarios",
    });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorIdController = async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error(
      "Error obteniendo usuario:",
      error.message
    );

    res.status(400).json({
      mensaje: "ID de usuario inválido",
    });
  }
};

// Actualizar usuario
export const actualizarUsuarioController = async (req, res) => {
  try {
    const usuario = await actualizarUsuario(
      req.params.id,
      req.body
    );

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(
      "Error actualizando usuario:",
      error.message
    );

    // No permitir modificar al último administrador activo
    if (
      error.message ===
      "No se puede modificar al último administrador activo"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Email duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El email ya está registrado",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos del usuario no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo actualizar el usuario",
    });
  }
};

// Eliminar usuario
export const eliminarUsuarioController = async (req, res) => {
  try {
    const usuario = await eliminarUsuario(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(
      "Error eliminando usuario:",
      error.message
    );

    // No permitir eliminar al último administrador activo
    if (
      error.message ===
      "No se puede eliminar al último administrador activo"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo eliminar el usuario",
    });
  }
};