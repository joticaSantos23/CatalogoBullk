import cors from "cors";
import express from "express";

import productoRoutes from "./modules/productos/producto.routes.js";
import categoriaRoutes from "./modules/categorias/categoria.routes.js";
import proveedorRoutes from "./modules/proveedores/proveedor.routes.js";
import importRoutes from "./modules/imports/import.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usuarioRoutes from "./modules/usuarios/usuario.routes.js";

import { verificarToken } from "./middlewares/auth.middleware.js";
import { manejarErrores } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:9000",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de CatalogoBulk 🚀",
  });
});

// Ruta protegida de prueba
app.get("/api/auth/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Token válido. Acceso autorizado 🔐",
    usuario: req.usuario,
  });
});

// Rutas de la API
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/importaciones", importRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Middleware global para manejar errores
app.use(manejarErrores);

export default app;