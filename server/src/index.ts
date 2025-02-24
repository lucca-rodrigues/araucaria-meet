import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./routes/room.routes";
import { WebSocketManager } from "./infra/websocket/websocket.manager";
import logger from "./config/logger";
import { connectToMongoDB } from "./infra/db/config/db.config";
import { RoomService } from "./modules/rooms/room.service";
import { RoomUseCases } from "./modules/rooms/room.useCases";
import { InMemoryRoomRepository } from "./infra/db/repositories/room.repository.memory";

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o servidor Express
const app = express();
const server = http.createServer(app);

// Configurar middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Configurar rotas
app.use("/api", roomRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Tentar conectar ao MongoDB
if (process.env.NODE_ENV !== "test") {
  connectToMongoDB().catch((error) => {
    logger.warn("Running without MongoDB connection. Using in-memory repository instead.");
    logger.error("MongoDB connection error:", error);
  });
}

// Configurar o WebSocket
// Como pode estar usando o repositório in-memory, vamos inicializá-lo aqui
const roomRepository = new InMemoryRoomRepository();
const roomUseCases = new RoomUseCases(roomRepository);
const roomService = new RoomService(roomUseCases);
new WebSocketManager(server, roomService);
