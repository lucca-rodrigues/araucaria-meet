import mongoose from "mongoose";
import logger from "../../../config/logger";

/**
 * Conecta ao MongoDB
 * @returns Promise que resolve quando a conexão é estabelecida
 */
export async function connectToMongoDB(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/araucaria-meet";
    await mongoose.connect(uri);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

/**
 * Desconecta do MongoDB
 */
export async function disconnectFromMongoDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
}

/**
 * Verifica se o MongoDB está conectado
 * @returns true se conectado, false se não conectado
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
