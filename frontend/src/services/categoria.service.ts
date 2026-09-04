import api from "./api";

export interface Categoria {
  _id: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CrearCategoriaData {
  nombre: string;
  descripcion?: string;
}

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const respuesta = await api.get("/categorias");

  if (Array.isArray(respuesta.data)) {
    return respuesta.data;
  }

  if (Array.isArray(respuesta.data.categorias)) {
    return respuesta.data.categorias;
  }

  if (Array.isArray(respuesta.data.data)) {
    return respuesta.data.data;
  }

  return [];
};

export const crearCategoria = async (
  datos: CrearCategoriaData
): Promise<Categoria> => {
  const respuesta = await api.post("/categorias", datos);

  return respuesta.data.categoria || respuesta.data;
};

export const actualizarCategoria = async (
  id: string,
  datos: CrearCategoriaData
): Promise<Categoria> => {
  const respuesta = await api.put(`/categorias/${id}`, datos);

  return respuesta.data.categoria || respuesta.data;
};

export const eliminarCategoria = async (
  id: string
): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};