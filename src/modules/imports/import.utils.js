import XLSX from "xlsx";

export const leerArchivo = (archivo) => {
  // Eliminar BOM UTF-8 si existe
  if (
    archivo.length >= 3 &&
    archivo[0] === 0xef &&
    archivo[1] === 0xbb &&
    archivo[2] === 0xbf
  ) {
    archivo = archivo.subarray(3);
  }

  const workbook = XLSX.read(archivo, {
    type: "buffer",
    codepage: 65001,
  });

  const nombreHoja = workbook.SheetNames[0];
  const hoja = workbook.Sheets[nombreHoja];

  const datos = XLSX.utils.sheet_to_json(hoja, {
    defval: "",
  });

  // Normalizar nombres de las columnas
  return datos.map((fila) => {
    const filaNormalizada = {};

    Object.entries(fila).forEach(([clave, valor]) => {
      const claveNormalizada = clave
        .replace(/^\uFEFF/, "")
        .trim()
        .toLowerCase();

      filaNormalizada[claveNormalizada] = valor;
    });

    return filaNormalizada;
  });
};