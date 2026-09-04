import { Router } from "express";

import {
  crearCategoriaController,
  obtenerCategoriasController,
  obtenerCategoriaPorIdController,
  actualizarCategoriaController,
  eliminarCategoriaController,
} from "./categoria.controller.js";

import { verificarToken } from "../../middlewares/auth.middleware.js";
import { verificarRol } from "../../middlewares/role.middleware.js";

const router = Router();

// Crear categoría → solo ADMIN 👑
router.post(
  "/",
  verificarToken,
  verificarRol("admin"),
  crearCategoriaController
);

// Obtener categorías → usuarios autenticados 🔐
router.get(
  "/",
  verificarToken,
  obtenerCategoriasController
);

// Obtener categoría por ID → usuarios autenticados 🔐
router.get(
  "/:id",
  verificarToken,
  obtenerCategoriaPorIdController
);

// Actualizar categoría → solo ADMIN 👑
router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarCategoriaController
);

// Eliminar categoría → solo ADMIN 👑
router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarCategoriaController
);

export default router;