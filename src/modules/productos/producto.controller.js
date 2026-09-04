import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "./producto.service.js";

// Crear producto
export const crearProductoController = async (req, res) => {
  try {
    const producto = await crearProducto(req.body);

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    console.error(
      "Error creando producto:",
      error.message
    );

    // Código duplicado
    if (
      error.message ===
      "El código del producto ya existe"
    ) {
      return res.status(409).json({
        mensaje: error.message,
      });
    }

    // Categoría inexistente
    if (
      error.message ===
      "La categoría seleccionada no existe"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Precio inválido
    if (
      error.message ===
      "El precio debe ser un número mayor o igual a 0"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Stock inválido
    if (
      error.message ===
      "El stock debe ser un número mayor o igual a 0"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Código duplicado de MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El código del producto ya existe",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos del producto no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo crear el producto",
    });
  }
};

// Obtener todos los productos
export const obtenerProductosController = async (req, res) => {
  try {
    const productos = await obtenerProductos();

    res.json({
      cantidad: productos.length,
      productos,
    });
  } catch (error) {
    console.error(
      "Error obteniendo productos:",
      error.message
    );

    res.status(500).json({
      mensaje: "No se pudieron obtener los productos",
    });
  }
};

// Obtener producto por ID
export const obtenerProductoPorIdController = async (req, res) => {
  try {
    const producto = await obtenerProductoPorId(
      req.params.id
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    console.error(
      "Error obteniendo producto:",
      error.message
    );

    res.status(400).json({
      mensaje: "ID de producto inválido",
    });
  }
};

// Actualizar producto
export const actualizarProductoController = async (req, res) => {
  try {
    const producto = await actualizarProducto(
      req.params.id,
      req.body
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    console.error(
      "Error actualizando producto:",
      error.message
    );

    // Código duplicado
    if (
      error.message ===
      "El código del producto ya existe"
    ) {
      return res.status(409).json({
        mensaje: error.message,
      });
    }

    // Categoría inexistente
    if (
      error.message ===
      "La categoría seleccionada no existe"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Precio inválido
    if (
      error.message ===
      "El precio debe ser un número mayor o igual a 0"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Stock inválido
    if (
      error.message ===
      "El stock debe ser un número mayor o igual a 0"
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    // Código duplicado de MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El código del producto ya existe",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos del producto no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo actualizar el producto",
    });
  }
};

// Eliminar producto
export const eliminarProductoController = async (req, res) => {
  try {
    const producto = await eliminarProducto(
      req.params.id
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
      producto,
    });
  } catch (error) {
    console.error(
      "Error eliminando producto:",
      error.message
    );

    res.status(400).json({
      mensaje: "No se pudo eliminar el producto",
    });
  }
};