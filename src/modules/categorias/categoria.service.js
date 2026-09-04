import Categoria from "./categoria.model.js";

export const crearCategoria = async (datos) => {
  const categoria = new Categoria(datos);

  return await categoria.save();
};

export const obtenerCategorias = async () => {
  return await Categoria.find().sort({ createdAt: -1 });
};

export const obtenerCategoriaPorId = async (id) => {
  return await Categoria.findById(id);
};

export const actualizarCategoria = async (id, datos) => {
  return await Categoria.findByIdAndUpdate(
    id,
    datos,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const eliminarCategoria = async (id) => {
  return await Categoria.findByIdAndDelete(id);
};