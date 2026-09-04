import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    contacto: {
      type: String,
      default: "",
      trim: true,
    },

    telefono: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    direccion: {
      type: String,
      default: "",
      trim: true,
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

const Proveedor = mongoose.model("Proveedor", proveedorSchema);

export default Proveedor;