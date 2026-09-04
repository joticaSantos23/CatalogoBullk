import api from "./api";

export interface Proveedor {
  _id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearProveedorData {
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo?: boolean;
}

export const obtenerProveedores = async (): Promise<Proveedor[]> => {
  const respuesta = await api.get("/proveedores");

  if (Array.isArray(respuesta.data)) {
    return respuesta.data;
  }

  if (Array.isArray(respuesta.data.proveedores)) {
    return respuesta.data.proveedores;
  }

  return [];
};

export const crearProveedor = async (
  datos: CrearProveedorData
): Promise<Proveedor> => {
  const respuesta = await api.post("/proveedores", datos);

  return respuesta.data.proveedor || respuesta.data;
};

export const actualizarProveedor = async (
  id: string,
  datos: CrearProveedorData
): Promise<Proveedor> => {
  const respuesta = await api.put(`/proveedores/${id}`, datos);

  return respuesta.data.proveedor || respuesta.data;
};

export const eliminarProveedor = async (
  id: string
): Promise<void> => {
  await api.delete(`/proveedores/${id}`);
};