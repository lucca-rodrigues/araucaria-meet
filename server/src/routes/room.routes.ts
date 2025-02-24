import { Router } from "express";
import { RoomController } from "../modules/rooms/room.controller";
import { RoomService } from "../modules/rooms/room.service";
import { RoomUseCases } from "../modules/rooms/room.useCases";
import { MongoDBRoomRepository } from "../infra/db/repositories/room.repository";
import { InMemoryRoomRepository } from "../infra/db/repositories/room.repository.memory";
import { isConnected } from "../infra/db/config/db.config";

const router = Router();

// Decide qual repositório usar com base na conexão do MongoDB
const repository = isConnected() ? new MongoDBRoomRepository() : new InMemoryRoomRepository();

const roomUseCases = new RoomUseCases(repository);
const roomService = new RoomService(roomUseCases);
const roomController = new RoomController(roomService);

// Rotas para salas
router.post("/rooms", async (req, res) => {
  await roomController.createRoom(req, res);
});

router.get("/rooms/:roomId", async (req, res) => {
  await roomController.getRoomById(req, res);
});

router.post("/rooms/:roomId/end", async (req, res) => {
  await roomController.endRoom(req, res);
});

export default router;
