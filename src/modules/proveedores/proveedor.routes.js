import { Router } from "express";

import {
  crearProveedorController,
  obtenerProveedoresController,
  obtenerProveedorPorIdController,
  actualizarProveedorController,
  eliminarProveedorController,
} from "./proveedor.controller.js";

import { verificarToken } from "../../middlewares/auth.middleware.js";
import { verificarRol } from "../../middlewares/role.middleware.js";

const router = Router();

// Crear proveedor → solo ADMIN 👑
router.post(
  "/",
  verificarToken,
  verificarRol("admin"),
  crearProveedorController
);

// Obtener proveedores → usuarios autenticados 🔐
router.get(
  "/",
  verificarToken,
  obtenerProveedoresController
);

// Obtener proveedor por ID → usuarios autenticados 🔐
router.get(
  "/:id",
  verificarToken,
  obtenerProveedorPorIdController
);

// Actualizar proveedor → por ahora solo ADMIN 👑
router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarProveedorController
);

// Eliminar proveedor → por ahora solo ADMIN 👑
router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarProveedorController
);

export default router;