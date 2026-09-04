import mongoose from "mongoose";

const importSchema = new mongoose.Schema(
  {
    nombreArchivo: {
      type: String,
      required: true,
      trim: true,
    },

    estado: {
      type: String,
      enum: ["pendiente", "procesando", "completado", "error"],
      default: "pendiente",
    },

    totalRegistros: {
      type: Number,
      default: 0,
    },

    registrosProcesados: {
      type: Number,
      default: 0,
    },

    registrosExitosos: {
      type: Number,
      default: 0,
    },

    registrosConError: {
      type: Number,
      default: 0,
    },

    errores: {
      type: [
        {
          fila: Number,
          mensaje: String,
        },
      ],
      default: [],
    },

    fechaInicio: {
      type: Date,
    },

    fechaFin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Importacion = mongoose.model("Importacion", importSchema);

export default Importacion;