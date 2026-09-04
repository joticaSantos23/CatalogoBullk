import { createClient } from "redis";
import { env } from "./env.js";

const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
});

redisClient.on("error", (error) => {
  console.error("❌ Error de Redis:", error.message);
});

redisClient.on("connect", () => {
  console.log("🔌 Conectando con Redis...");
});

redisClient.on("ready", () => {
  console.log("⚡ Redis listo para utilizarse");
});

export const conectarRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

export default redisClient;