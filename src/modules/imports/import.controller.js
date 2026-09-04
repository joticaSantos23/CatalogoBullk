import {
  crearImportacion,
  obtenerImportaciones,
  obtenerImportacionPorId,
  actualizarImportacion,
  eliminarImportacion,
  procesarArchivo,
} from "./import.service.js";

import redisClient from "../../config/redis.js";

// Crear importación
export const crearImportacionController = async (req, res) => {
  try {
    const importacion = await crearImportacion(req.body);

    res.status(201).json({
      mensaje: "Importación creada correctamente",
      importacion,
    });
  } catch (error) {
    console.error("Error creando importación:", error.message);

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos de la importación no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo crear la importación",
    });
  }
};

// Obtener todas las importaciones
export const obtenerImportacionesController = async (req, res) => {
  try {
    const importaciones = await obtenerImportaciones();

    res.json({
      cantidad: importaciones.length,
      importaciones,
    });
  } catch (error) {
    console.error(
      "Error obteniendo importaciones:",
      error.message
    );

    res.status(500).json({
      mensaje: "No se pudieron obtener las importaciones",
    });
  }
};

// Obtener importación por ID
export const obtenerImportacionPorIdController = async (req, res) => {
  try {
    const importacion = await obtenerImportacionPorId(req.params.id);

    if (!importacion) {
      return res.status(404).json({
        mensaje: "Importación no encontrada",
      });
    }

    res.json(importacion);
  } catch (error) {
    console.error(
      "Error obteniendo importación:",
      error.message
    );

    res.status(400).json({
      mensaje: "ID de importación inválido",
    });
  }
};

// Actualizar importación
export const actualizarImportacionController = async (req, res) => {
  try {
    const importacion = await actualizarImportacion(
      req.params.id,
      req.body
    );

    if (!importacion) {
      return res.status(404).json({
        mensaje: "Importación no encontrada",
      });
    }

    res.json({
      mensaje: "Importación actualizada correctamente",
      importacion,
    });
  } catch (error) {
    console.error(
      "Error actualizando importación:",
      error.message
    );

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos de la importación no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo actualizar la importación",
    });
  }
};

// Eliminar importación
export const eliminarImportacionController = async (req, res) => {
  try {
    const importacion = await eliminarImportacion(req.params.id);

    if (!importacion) {
      return res.status(404).json({
        mensaje: "Importación no encontrada",
      });
    }

    res.json({
      mensaje: "Importación eliminada correctamente",
    });
  } catch (error) {
    console.error(
      "Error eliminando importación:",
      error.message
    );

    res.status(400).json({
      mensaje: "No se pudo eliminar la importación",
    });
  }
};

// Procesar archivo
export const procesarArchivoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        mensaje: "No se recibió ningún archivo",
      });
    }

    const resultado = await procesarArchivo(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      mensaje: "Archivo procesado correctamente",
      importacionId: resultado.importacionId,
      totalRegistros: resultado.totalRegistros,
      registrosExitosos: resultado.registrosExitosos,
      registrosConError: resultado.registrosConError,
      registros: resultado.registros,
      errores: resultado.errores,
    });
  } catch (error) {
    console.error(
      "Error procesando archivo:",
      error.message
    );

    res.status(400).json({
      mensaje: "No se pudo procesar el archivo",
    });
  }
};

// Obtener progreso de una importación desde Redis
export const obtenerProgresoImportacionController = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const progreso = await redisClient.get(
      `importacion:${id}:progreso`
    );

    if (!progreso) {
      return res.status(404).json({
        mensaje:
          "No se encontró información de progreso para esta importación",
      });
    }

    res.json(JSON.parse(progreso));
  } catch (error) {
    console.error(
      "Error obteniendo progreso:",
      error.message
    );

    res.status(500).json({
      mensaje: "No se pudo obtener el progreso de la importación",
    });
  }
};

