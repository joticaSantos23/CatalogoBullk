import { Router } from "express";

import {
  crearImportacionController,
  procesarArchivoController,
  obtenerImportacionesController,
  obtenerImportacionPorIdController,
  actualizarImportacionController,
  eliminarImportacionController,
  obtenerProgresoImportacionController,
} from "./import.controller.js";

import { verificarToken } from "../../middlewares/auth.middleware.js";
import { verificarRol } from "../../middlewares/role.middleware.js";
import { subirArchivo } from "./upload.middleware.js";

const router = Router();

// Crear importación → solo ADMIN 👑
router.post(
  "/",
  verificarToken,
  verificarRol("admin"),
  crearImportacionController
);

// Procesar archivo CSV/Excel → solo ADMIN 👑
router.post(
  "/archivo",
  verificarToken,
  verificarRol("admin"),
  subirArchivo,
  procesarArchivoController
);

// Obtener todas las importaciones → usuarios autenticados 🔐
router.get(
  "/",
  verificarToken,
  obtenerImportacionesController
);

// Obtener progreso → usuarios autenticados 🔐
router.get(
  "/:id/progreso",
  verificarToken,
  obtenerProgresoImportacionController
);

// Obtener importación por ID → usuarios autenticados 🔐
router.get(
  "/:id",
  verificarToken,
  obtenerImportacionPorIdController
);

// Actualizar importación → solo ADMIN 👑
router.put(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  actualizarImportacionController
);

// Eliminar importación → solo ADMIN 👑
router.delete(
  "/:id",
  verificarToken,
  verificarRol("admin"),
  eliminarImportacionController
);

export default router;