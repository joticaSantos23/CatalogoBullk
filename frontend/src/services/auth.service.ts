import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface Usuario {
  id: string;
  email: string;
  rol: "admin" | "usuario";
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
  token: string;
}

export const iniciarSesion = async (
  datos: LoginData
): Promise<LoginResponse> => {
  const respuesta = await api.post<LoginResponse>("/auth/login", datos);

  return respuesta.data;
};