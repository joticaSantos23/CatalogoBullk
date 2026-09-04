import api from "./api";

export interface Producto {
  _id: string;

  codigo: string;

  nombre: string;

  descripcion?: string;

  imagenUrl?: string;

  precio: number;

  stock: number;

  categoria?: string;

  activo: boolean;
}

export interface CrearProductoData {
  codigo: string;

  nombre: string;

  descripcion: string;

  imagenUrl: string;

  precio: number;

  stock: number;

  categoria: string;

  activo?: boolean;
}

export const obtenerProductos = async (): Promise<Producto[]> => {
  const respuesta = await api.get("/productos");

  if (Array.isArray(respuesta.data)) {
    return respuesta.data;
  }

  if (Array.isArray(respuesta.data.productos)) {
    return respuesta.data.productos;
  }

  if (Array.isArray(respuesta.data.data)) {
    return respuesta.data.data;
  }

  return [];
};

export const crearProducto = async (
  datos: CrearProductoData
): Promise<Producto> => {
  const respuesta = await api.post("/productos", datos);

  return respuesta.data.producto || respuesta.data;
};