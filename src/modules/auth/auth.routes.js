import { Router } from "express";

import {
  registrarUsuarioController,
  iniciarSesionController,
} from "./auth.controller.js";

const router = Router();

// Registrar usuario
router.post("/registro", registrarUsuarioController);

// Iniciar sesión
router.post("/login", iniciarSesionController);

export default router;