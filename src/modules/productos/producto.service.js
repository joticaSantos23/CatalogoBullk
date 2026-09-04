import mongoose from "mongoose";

import Producto from "./producto.model.js";
import Categoria from "../categorias/categoria.model.js";
import Proveedor from "../proveedores/proveedor.model.js";

// ==========================================
// CREAR PRODUCTO
// ==========================================

export const crearProducto = async (datos) => {
  // Verificar datos básicos
  if (!datos.codigo || !datos.nombre) {
    throw new Error(
      "El código y nombre del producto son obligatorios"
    );
  }

  // Verificar código duplicado
  const codigo = datos.codigo.trim().toUpperCase();

  const productoExistente = await Producto.findOne({
    codigo,
  });

  if (productoExistente) {
    throw new Error("El código del producto ya existe");
  }

  // ==========================================
  // VERIFICAR CATEGORÍA
  // ==========================================

  if (
    !datos.categoria ||
    !mongoose.Types.ObjectId.isValid(datos.categoria)
  ) {
    throw new Error("La categoría seleccionada no existe");
  }

  const categoria = await Categoria.findById(datos.categoria);

  if (!categoria) {
    throw new Error("La categoría seleccionada no existe");
  }

  // ==========================================
  // VERIFICAR PROVEEDOR
  // ==========================================

  if (!datos.proveedor) {
    throw new Error("El proveedor es obligatorio");
  }

  if (!mongoose.Types.ObjectId.isValid(datos.proveedor)) {
    throw new Error("El proveedor seleccionado no existe");
  }

  const proveedor = await Proveedor.findById(datos.proveedor);

  if (!proveedor) {
    throw new Error("El proveedor seleccionado no existe");
  }

  // ==========================================
  // VALIDAR PRECIO
  // ==========================================

  if (
    typeof datos.precio !== "number" ||
    datos.precio < 0
  ) {
    throw new Error(
      "El precio debe ser un número mayor o igual a 0"
    );
  }

  // ==========================================
  // VALIDAR STOCK
  // ==========================================

  if (
    typeof datos.stock !== "number" ||
    datos.stock < 0
  ) {
    throw new Error(
      "El stock debe ser un número mayor o igual a 0"
    );
  }

  // ==========================================
  // CREAR PRODUCTO
  // ==========================================

  const producto = new Producto({
    codigo,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion?.trim() || "",

    // URL de la imagen
    imagenUrl: datos.imagenUrl?.trim() || "",

    precio: datos.precio,
    stock: datos.stock,

    // Guardamos el ID de la categoría
    categoria: datos.categoria,

    // Guardamos el ID del proveedor
    proveedor: proveedor._id,

    // Por defecto el producto queda activo
    activo:
      datos.activo !== undefined
        ? datos.activo
        : true,
  });

  return await producto.save();
};

// ==========================================
// OBTENER TODOS LOS PRODUCTOS
// ==========================================

export const obtenerProductos = async () => {
  return await Producto.find()
    .populate("categoria")
    .populate("proveedor")
    .sort({ createdAt: -1 });
};

// ==========================================
// OBTENER PRODUCTO POR ID
// ==========================================

export const obtenerProductoPorId = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Producto.findById(id)
    .populate("categoria")
    .populate("proveedor");
};

// ==========================================
// ACTUALIZAR PRODUCTO
// ==========================================

export const actualizarProducto = async (id, datos) => {
  // ==========================================
  // VERIFICAR ID DEL PRODUCTO
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const producto = await Producto.findById(id);

  if (!producto) {
    return null;
  }

  // ==========================================
  // VERIFICAR CÓDIGO DUPLICADO
  // ==========================================

  let codigoActual = producto.codigo;

  if (datos.codigo) {
    codigoActual = datos.codigo
      .trim()
      .toUpperCase();

    const codigoExistente = await Producto.findOne({
      codigo: codigoActual,
      _id: { $ne: id },
    });

    if (codigoExistente) {
      throw new Error(
        "El código del producto ya existe"
      );
    }
  }

  // ==========================================
  // VERIFICAR CATEGORÍA
  // ==========================================

  let categoriaActual = producto.categoria;

  if (datos.categoria) {
    if (
      !mongoose.Types.ObjectId.isValid(datos.categoria)
    ) {
      throw new Error(
        "La categoría seleccionada no existe"
      );
    }

    const categoria = await Categoria.findById(
      datos.categoria
    );

    if (!categoria) {
      throw new Error(
        "La categoría seleccionada no existe"
      );
    }

    categoriaActual = datos.categoria;
  }

  // ==========================================
  // VERIFICAR PROVEEDOR
  // ==========================================

  let proveedorActual = producto.proveedor;

  if (datos.proveedor) {
    if (
      !mongoose.Types.ObjectId.isValid(datos.proveedor)
    ) {
      throw new Error(
        "El proveedor seleccionado no existe"
      );
    }

    const proveedor = await Proveedor.findById(
      datos.proveedor
    );

    if (!proveedor) {
      throw new Error(
        "El proveedor seleccionado no existe"
      );
    }

    // Guardamos el ID del proveedor
    proveedorActual = proveedor._id;
  }

  // ==========================================
  // VALIDAR PRECIO
  // ==========================================

  let precioActual = producto.precio;

  if (datos.precio !== undefined) {
    if (
      typeof datos.precio !== "number" ||
      datos.precio < 0
    ) {
      throw new Error(
        "El precio debe ser un número mayor o igual a 0"
      );
    }

    precioActual = datos.precio;
  }

  // ==========================================
  // VALIDAR STOCK
  // ==========================================

  let stockActual = producto.stock;

  if (datos.stock !== undefined) {
    if (
      typeof datos.stock !== "number" ||
      datos.stock < 0
    ) {
      throw new Error(
        "El stock debe ser un número mayor o igual a 0"
      );
    }

    stockActual = datos.stock;
  }

  // ==========================================
  // VALIDAR ESTADO ACTIVO
  // ==========================================

  let activoActual = producto.activo;

  if (datos.activo !== undefined) {
    if (typeof datos.activo !== "boolean") {
      throw new Error(
        "El estado activo debe ser verdadero o falso"
      );
    }

    activoActual = datos.activo;
  }

  // ==========================================
  // IMAGEN
  // ==========================================

  let imagenActual = producto.imagenUrl;

  if (datos.imagenUrl !== undefined) {
    imagenActual = datos.imagenUrl.trim();
  }

  // ==========================================
  // ACTUALIZAR PRODUCTO
  // ==========================================

  return await Producto.findByIdAndUpdate(
    id,
    {
      codigo: codigoActual,

      nombre: datos.nombre
        ? datos.nombre.trim()
        : producto.nombre,

      descripcion:
        datos.descripcion !== undefined
          ? datos.descripcion.trim()
          : producto.descripcion,

      imagenUrl: imagenActual,

      precio: precioActual,

      stock: stockActual,

      categoria: categoriaActual,

      proveedor: proveedorActual,

      activo: activoActual,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("categoria")
    .populate("proveedor");
};

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

export const eliminarProducto = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Producto.findByIdAndDelete(id);
};