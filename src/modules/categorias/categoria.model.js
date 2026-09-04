import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;