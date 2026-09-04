export const manejarErrores = (error, req, res, next) => {
  console.error("❌ Error:", error);

  // Error de Multer por tamaño de archivo
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      mensaje: "El archivo supera el tamaño máximo permitido de 50 MB",
    });
  }

  // Error de archivo no permitido
  if (
    error.message ===
    "Solo se permiten archivos CSV, XLSX o XLS"
  ) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }

  // Error de JSON mal formado
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      mensaje: "El JSON enviado no tiene un formato válido",
    });
  }

  // Error genérico
  return res.status(500).json({
    mensaje: "Ocurrió un error interno en el servidor",
  });
};
