import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { conectarRedis } from "./config/redis.js";

const iniciarServidor = async () => {
  try {
    // Conectar MongoDB
    await connectDB();

    // Conectar Redis
    await conectarRedis();

    // Iniciar servidor
    app.listen(env.PORT, () => {
      console.log(
        `🚀 Servidor ejecutándose en http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ No se pudo iniciar el servidor:",
      error.message
    );

    process.exit(1);
  }
};

iniciarServidor();