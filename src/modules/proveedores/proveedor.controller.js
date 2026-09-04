import {
  crearProveedor,
  obtenerProveedores,
  obtenerProveedorPorId,
  actualizarProveedor,
  eliminarProveedor,
} from "./proveedor.service.js";

export const crearProveedorController = async (req, res) => {
  try {
    const proveedor = await crearProveedor(req.body);

    res.status(201).json({
      mensaje: "Proveedor creado correctamente",
      proveedor,
    });
  } catch (error) {
    console.error("Error creando proveedor:", error.message);

    // Proveedor duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El proveedor ya existe",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos del proveedor no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo crear el proveedor",
    });
  }
};

export const obtenerProveedoresController = async (req, res) => {
  try {
    const proveedores = await obtenerProveedores();

    res.json({
      cantidad: proveedores.length,
      proveedores,
    });
  } catch (error) {
    console.error("Error obteniendo proveedores:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron obtener los proveedores",
    });
  }
};

export const obtenerProveedorPorIdController = async (req, res) => {
  try {
    const proveedor = await obtenerProveedorPorId(req.params.id);

    if (!proveedor) {
      return res.status(404).json({
        mensaje: "Proveedor no encontrado",
      });
    }

    res.json(proveedor);
  } catch (error) {
    console.error("Error obteniendo proveedor:", error.message);

    res.status(400).json({
      mensaje: "ID de proveedor inválido",
    });
  }
};

export const actualizarProveedorController = async (req, res) => {
  try {
    const proveedor = await actualizarProveedor(
      req.params.id,
      req.body
    );

    if (!proveedor) {
      return res.status(404).json({
        mensaje: "Proveedor no encontrado",
      });
    }

    res.json({
      mensaje: "Proveedor actualizado correctamente",
      proveedor,
    });
  } catch (error) {
    console.error("Error actualizando proveedor:", error.message);

    // Proveedor duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El proveedor ya existe",
      });
    }

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (detalle) => detalle.message
      );

      return res.status(400).json({
        mensaje: "Los datos del proveedor no son válidos",
        errores,
      });
    }

    res.status(400).json({
      mensaje: "No se pudo actualizar el proveedor",
    });
  }
};

export const eliminarProveedorController = async (req, res) => {
  try {
    const proveedor = await eliminarProveedor(req.params.id);

    if (!proveedor) {
      return res.status(404).json({
        mensaje: "Proveedor no encontrado",
      });
    }

    res.json({
      mensaje: "Proveedor eliminado correctamente",
      proveedor,
    });
  } catch (error) {
    console.error("Error eliminando proveedor:", error.message);

    res.status(400).json({
      mensaje: "No se pudo eliminar el proveedor",
    });
  }
};

