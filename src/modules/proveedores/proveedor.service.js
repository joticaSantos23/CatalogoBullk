import Proveedor from "./proveedor.model.js";

export const crearProveedor = async (datos) => {
  const proveedor = new Proveedor(datos);
  return await proveedor.save();
};

export const obtenerProveedores = async () => {
  return await Proveedor.find().sort({ createdAt: -1 });
};

export const obtenerProveedorPorId = async (id) => {
  return await Proveedor.findById(id);
};

export const actualizarProveedor = async (id, datos) => {
  return await Proveedor.findByIdAndUpdate(
    id,
    datos,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const eliminarProveedor = async (id) => {
  return await Proveedor.findByIdAndDelete(id);
};