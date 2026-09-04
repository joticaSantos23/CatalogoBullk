import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
} from "./categoria.service.js";

export const crearCategoriaController = async (req, res) => {
  try {
    const categoria = await crearCategoria(req.body);

    res.status(201).json({
      mensaje: "Categoría creada correctamente",
      categoria,
    });
  } catch (error) {
    console.error("Error creando categoría:", error.message);

    // Categoría duplicada
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "La categoría ya existe",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos de la categoría no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo crear la categoría",
    });
  }
};

export const obtenerCategoriasController = async (req, res) => {
  try {
    const categorias = await obtenerCategorias();

    res.json({
      cantidad: categorias.length,
      categorias,
    });
  } catch (error) {
    console.error("Error obteniendo categorías:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron obtener las categorías",
    });
  }
};

export const obtenerCategoriaPorIdController = async (req, res) => {
  try {
    const categoria = await obtenerCategoriaPorId(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    res.json(categoria);
  } catch (error) {
    console.error("Error obteniendo categoría:", error.message);

    res.status(400).json({
      mensaje: "ID de categoría inválido",
    });
  }
};

export const actualizarCategoriaController = async (req, res) => {
  try {
    const categoria = await actualizarCategoria(
      req.params.id,
      req.body
    );

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    res.json({
      mensaje: "Categoría actualizada correctamente",
      categoria,
    });
  } catch (error) {
    console.error("Error actualizando categoría:", error.message);

    // Categoría duplicada
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "La categoría ya existe",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos de la categoría no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo actualizar la categoría",
    });
  }
};

export const eliminarCategoriaController = async (req, res) => {
  try {
    const categoria = await eliminarCategoria(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    res.json({
      mensaje: "Categoría eliminada correctamente",
      categoria,
    });
  } catch (error) {
    console.error("Error eliminando categoría:", error.message);

    res.status(400).json({
      mensaje: "No se pudo eliminar la categoría",
    });
  }
};