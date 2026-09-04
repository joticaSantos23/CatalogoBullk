import api from "./api";

export interface ErrorImportacion {
  fila: number;
  mensaje: string;
}

export interface Importacion {
  _id: string;
  nombreArchivo: string;
  estado: "pendiente" | "procesando" | "completado" | "error";
  totalRegistros: number;
  registrosProcesados: number;
  registrosExitosos: number;
  registrosConError: number;
  errores: ErrorImportacion[];
  fechaInicio?: string;
  fechaFin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResultadoImportacion {
  mensaje: string;
  importacionId: string;
  totalRegistros: number;
  registrosExitosos: number;
  registrosConError: number;
  registros: any[];
  errores: ErrorImportacion[];
}

export interface ProgresoImportacion {
  importacionId: string;
  totalRegistros: number;
  registrosProcesados: number;
  registrosExitosos: number;
  registrosConError: number;
  porcentaje: number;
  estado: "pendiente" | "procesando" | "completado" | "error";
}

export const obtenerImportaciones = async (): Promise<Importacion[]> => {
  const respuesta = await api.get("/importaciones");

  if (Array.isArray(respuesta.data)) {
    return respuesta.data;
  }

  if (Array.isArray(respuesta.data.importaciones)) {
    return respuesta.data.importaciones;
  }

  if (Array.isArray(respuesta.data.data)) {
    return respuesta.data.data;
  }

  return [];
};

export const obtenerImportacionPorId = async (
  id: string
): Promise<Importacion> => {
  const respuesta = await api.get(`/importaciones/${id}`);
  return respuesta.data.importacion || respuesta.data;
};

export const subirArchivoImportacion = async (
  archivo: File
): Promise<ResultadoImportacion> => {
  const formulario = new FormData();

  formulario.append("archivo", archivo);

  const respuesta = await api.post<ResultadoImportacion>(
    "/importaciones/archivo",
    formulario,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return respuesta.data;
};

export const obtenerProgresoImportacion = async (
  id: string
): Promise<ProgresoImportacion> => {
  const respuesta = await api.get(
    `/importaciones/${id}/progreso`
  );

  return respuesta.data;
};

export const eliminarImportacion = async (
  id: string
): Promise<void> => {
  await api.delete(`/importaciones/${id}`);
};