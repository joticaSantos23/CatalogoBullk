import { Router } from "express";

import {
  crearProductoController,
  obtenerProductosController,
  obtenerProductoPorIdController,
  actualizarProductoController,
  eliminarProductoController,
} from "./producto.controller.js";

import { verificarToken } from "../../middlewares/auth.middleware.js";
import { verificarRol } from "../../middlewares/role.middleware.js";

const router = Router();

// Crear producto → solo ADMIN 👑
router.post(
  "/",
  verificarToken,
  verificarRol("admin"),
  crearProductoController
);

// Obtener productos → usuarios autenticados 🔐
router.get(
  "/",
  verificarToken,
  obtenerProductosController
);

// Obtener producto por ID → usuarios autenticados 🔐
router.get(
  "/:id",
  verificarToken,
  obtenerProductoPorIdController
);

// Actualizar producto → solo ADMIN 👑
router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarProductoController
);

// Eliminar producto → solo ADMIN 👑
router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarProductoController
);

export default router;