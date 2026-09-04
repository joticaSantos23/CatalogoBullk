import Importacion from "./import.model.js";

import { leerArchivo } from "./import.utils.js";

import Producto from "../productos/producto.model.js";

import Categoria from "../categorias/categoria.model.js";

import { env } from "../../config/env.js";

import redisClient from "../../config/redis.js";

export const crearImportacion = async (datos) => {
  const importacion = new Importacion(datos);

  return await importacion.save();
};

export const obtenerImportaciones = async () => {
  return await Importacion.find().sort({ createdAt: -1 });
};

export const obtenerImportacionPorId = async (id) => {
  return await Importacion.findById(id);
};

export const actualizarImportacion = async (id, datos) => {
  return await Importacion.findByIdAndUpdate(
    id,
    datos,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const eliminarImportacion = async (id) => {
  return await Importacion.findByIdAndDelete(id);
};

export const procesarArchivo = async (archivo, nombreArchivo) => {
  const datos = leerArchivo(archivo);

  const importacion = await crearImportacion({
    nombreArchivo: nombreArchivo || "archivo_sin_nombre",
    estado: "procesando",
    totalRegistros: datos.length,
    registrosProcesados: 0,
    registrosExitosos: 0,
    registrosConError: 0,
    errores: [],
    fechaInicio: new Date(),
  });

  const resultados = [];
  const errores = [];

  const codigosProcesados = new Set();

  const batchSize = env.BATCH_SIZE || 500;

  for (let inicio = 0; inicio < datos.length; inicio += batchSize) {
    const lote = datos.slice(inicio, inicio + batchSize);

    console.log(
      `📦 Procesando lote ${Math.floor(inicio / batchSize) + 1}...`
    );

    for (let i = 0; i < lote.length; i++) {
      const fila = lote[i];
      const numeroFila = inicio + i + 2;

      try {
        const codigo = String(fila.codigo ?? "").trim();
        const nombre = String(fila.nombre ?? "").trim();
        const descripcion = String(fila.descripcion ?? "").trim();
        const categoriaNombre = String(fila.categoria ?? "").trim();
        const proveedor = String(fila.proveedor ?? "").trim();

        const precio =
          fila.precio === "" ||
          fila.precio === null ||
          fila.precio === undefined
            ? NaN
            : Number(fila.precio);

        const stock =
          fila.stock === "" ||
          fila.stock === null ||
          fila.stock === undefined
            ? NaN
            : Number(fila.stock);

        if (!codigo) {
          throw new Error("El campo codigo es obligatorio");
        }

        if (!nombre) {
          throw new Error("El campo nombre es obligatorio");
        }

        if (!Number.isFinite(precio) || precio < 0) {
          throw new Error(
            "El precio debe ser un número mayor o igual a 0"
          );
        }

        if (!Number.isFinite(stock) || stock < 0) {
          throw new Error(
            "El stock debe ser un número mayor o igual a 0"
          );
        }

        if (!categoriaNombre) {
          throw new Error("El campo categoria es obligatorio");
        }

        if (!proveedor) {
          throw new Error("El campo proveedor es obligatorio");
        }

        if (codigosProcesados.has(codigo)) {
          throw new Error(
            `El código "${codigo}" está repetido dentro del archivo`
          );
        }

        const categoria = await Categoria.findOne({
          nombre: categoriaNombre,
        });

        if (!categoria) {
          throw new Error(
            `La categoría "${categoriaNombre}" no existe`
          );
        }

        const producto = new Producto({
          codigo,
          nombre,
          descripcion,
          precio,
          stock,
          categoria: categoria._id,
          proveedor,
        });

        await producto.save();

        codigosProcesados.add(codigo);
        resultados.push(producto);
      } catch (error) {
        let mensaje = error.message;

        // Código de producto duplicado en MongoDB
        if (error.code === 11000) {
          mensaje = "El código del producto ya existe";
        }

        errores.push({
          fila: numeroFila,
          mensaje,
        });
      }
    }

    const registrosProcesados = Math.min(
      inicio + lote.length,
      datos.length
    );

    await actualizarImportacion(importacion._id, {
      registrosProcesados,
      registrosExitosos: resultados.length,
      registrosConError: errores.length,
      errores,
    });

    const porcentaje = Math.round(
      (registrosProcesados / datos.length) * 100
    );

    await redisClient.set(
      `importacion:${importacion._id}:progreso`,
      JSON.stringify({
        importacionId: importacion._id,
        totalRegistros: datos.length,
        registrosProcesados,
        registrosExitosos: resultados.length,
        registrosConError: errores.length,
        porcentaje,
        estado: "procesando",
      }),
      {
        EX: env.CACHE_TTL_SECONDS,
      }
    );

    console.log(
      `✅ Lote terminado: ${registrosProcesados}/${datos.length} registros procesados`
    );
  }

  const estadoFinal =
    errores.length > 0 ? "error" : "completado";

  await actualizarImportacion(importacion._id, {
    estado: estadoFinal,
    registrosProcesados: datos.length,
    registrosExitosos: resultados.length,
    registrosConError: errores.length,
    errores,
    fechaFin: new Date(),
  });

  await redisClient.set(
    `importacion:${importacion._id}:progreso`,
    JSON.stringify({
      importacionId: importacion._id,
      totalRegistros: datos.length,
      registrosProcesados: datos.length,
      registrosExitosos: resultados.length,
      registrosConError: errores.length,
      porcentaje: 100,
      estado: estadoFinal,
    }),
    {
      EX: env.CACHE_TTL_SECONDS,
    }
  );

  console.log("🏁 Importación finalizada");

  return {
    importacionId: importacion._id,
    totalRegistros: datos.length,
    registrosExitosos: resultados.length,
    registrosConError: errores.length,
    registros: resultados,
    errores,
  };
};

