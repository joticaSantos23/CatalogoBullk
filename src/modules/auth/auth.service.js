import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Usuario from "./auth.model.js";
import { env } from "../../config/env.js";

// Registrar usuario
export const registrarUsuario = async ({
  nombre,
  email,
  password,
}) => {
  const emailNormalizado = email.toLowerCase().trim();

  // Verificar si el email ya existe
  const usuarioExistente = await Usuario.findOne({
    email: emailNormalizado,
  });

  if (usuarioExistente) {
    throw new Error("El email ya está registrado");
  }

  // Encriptar contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // El registro público siempre crea usuarios normales
  const usuario = new Usuario({
    nombre: nombre.trim(),
    email: emailNormalizado,
    password: passwordHash,
    rol: "usuario",
  });

  await usuario.save();

  // No devolver la contraseña
  const usuarioRespuesta = usuario.toObject();
  delete usuarioRespuesta.password;

  return usuarioRespuesta;
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  const emailNormalizado = email.toLowerCase().trim();

  // Buscar usuario
  const usuario = await Usuario.findOne({
    email: emailNormalizado,
  });

  if (!usuario) {
    throw new Error("Email o contraseña incorrectos");
  }

  // Verificar si está activo
  if (!usuario.activo) {
    throw new Error("El usuario está desactivado");
  }

  // Comparar contraseña
  const passwordCorrecta = await bcrypt.compare(
    password,
    usuario.password
  );

  if (!passwordCorrecta) {
    throw new Error("Email o contraseña incorrectos");
  }

  // Crear token JWT
  const token = jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      rol: usuario.rol,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  };
};