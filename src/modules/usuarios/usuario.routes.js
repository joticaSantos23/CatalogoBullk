import { Router } from "express";

import {
  obtenerUsuariosController,
  obtenerUsuarioPorIdController,
  actualizarUsuarioController,
  eliminarUsuarioController,
} from "./usuario.controller.js";

import { verificarToken } from "../../middlewares/auth.middleware.js";
import { verificarRol } from "../../middlewares/role.middleware.js";

const router = Router();

// Todas las rutas de usuarios requieren autenticación y rol admin
router.use(verificarToken, verificarRol("admin"));

// Obtener todos los usuarios
router.get("/", obtenerUsuariosController);

// Obtener usuario por ID
router.get("/:id", obtenerUsuarioPorIdController);

// Actualizar usuario
router.put("/:id", actualizarUsuarioController);

// Eliminar usuario
router.delete("/:id", eliminarUsuarioController);

export default router;