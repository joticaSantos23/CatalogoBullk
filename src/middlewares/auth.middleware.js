import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const verificarToken = (req, res, next) => {
  try {
    // Obtener el header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: "No se proporcionó un token de autenticación",
      });
    }

    // El formato esperado es:
    // Authorization: Bearer TOKEN
    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        mensaje: "Formato de token inválido",
      });
    }

    const token = partes[1];

    // Verificar el token
    const usuario = jwt.verify(token, env.JWT_SECRET);

    // Guardar los datos del usuario en la petición
    req.usuario = usuario;

    // Continuar hacia la ruta
    next();
  } catch (error) {
    console.error("Error verificando token:", error.message);

    return res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
};