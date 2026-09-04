import {
  registrarUsuario,
  iniciarSesion,
} from "./auth.service.js";

// Registrar usuario
export const registrarUsuarioController = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Nombre, email y contraseña son obligatorios",
      });
    }

    const usuario = await registrarUsuario({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
    });
  } catch (error) {
    console.error("Error registrando usuario:", error.message);

    if (error.message === "El email ya está registrado") {
      return res.status(409).json({
        mensaje: error.message,
      });
    }

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
      mensaje: "No se pudo registrar el usuario",
    });
  }
};

// Iniciar sesión
export const iniciarSesionController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y contraseña son obligatorios",
      });
    }

    const resultado = await iniciarSesion(email, password);

    res.json({
      mensaje: "Inicio de sesión exitoso",
      ...resultado,
    });
  } catch (error) {
    console.error("Error iniciando sesión:", error.message);

    if (
      error.message === "Email o contraseña incorrectos" ||
      error.message === "El usuario está desactivado"
    ) {
      return res.status(401).json({
        mensaje: error.message,
      });
    }

    res.status(401).json({
      mensaje: "No se pudo iniciar sesión",
    });
  }
};