import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    imagenUrl: {
      type: String,
      default: "",
      trim: true,
    },

    precio: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },

    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;