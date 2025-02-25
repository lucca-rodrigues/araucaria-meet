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

// Nova rota para criar sala de teste com horário ajustado para acesso imediato
router.post("/rooms/test", async (req, res) => {
  await roomController.createTestRoom(req, res);
});

// Nova rota para agendamento de salas
router.post("/rooms/schedule", async (req, res) => {
  await roomController.scheduleRoom(req, res);
});

// Nova rota para listar todas as salas
router.get("/rooms", async (req, res) => {
  await roomController.getAllRooms(req, res);
});

router.get("/rooms/:roomId", async (req, res) => {
  await roomController.getRoomById(req, res);
});

// Nova rota para participantes entrarem em uma sala
router.post("/rooms/:roomId/join", async (req, res) => {
  await roomController.joinRoom(req, res);
});

// Nova rota para participantes saírem de uma sala
router.post("/rooms/:roomId/leave", async (req, res) => {
  await roomController.leaveRoom(req, res);
});

router.post("/rooms/:roomId/end", async (req, res) => {
  await roomController.endRoom(req, res);
});

// Nova rota para obter mensagens de uma sala
router.get("/rooms/:roomId/messages", async (req, res) => {
  await roomController.getMessages(req, res);
});

export default router;
