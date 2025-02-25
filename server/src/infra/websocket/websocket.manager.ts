import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { RoomService } from "../../modules/rooms/room.service";
import logger from "../../config/logger";
import { Participant } from "../../modules/rooms/interfaces/room.interface";

export class WebSocketManager {
  private io: SocketIOServer;

  constructor(private readonly server: HTTPServer, private readonly roomService: RoomService) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on("join-room", async (data: { roomId: string; participant: any }) => {
        try {
          const { roomId, participant } = data;

          // Adiciona o socketId ao participante
          participant.socketId = socket.id;

          // Adiciona o participante à sala
          const room = await this.roomService.joinRoom(roomId, participant);

          if (!room) {
            socket.emit("room-error", { message: "Room not found or not available" });
            return;
          }

          // Entra na sala do Socket.IO
          socket.join(roomId);

          // Notifica outros participantes
          socket.to(roomId).emit("participant-joined", participant);

          // Envia lista de participantes atual
          socket.emit("room-participants", room.participants);

          // Busca as mensagens da sala e envia para o participante
          try {
            const messages = await this.roomService.getMessages(roomId);
            socket.emit("room-messages", messages);
          } catch (error) {
            logger.error(`Error getting messages for room ${roomId}:`, error);
          }

          logger.info(`Client ${socket.id} joined room ${roomId}`);
        } catch (error) {
          logger.error("Error in join-room handler:", error);
          socket.emit("room-error", { message: "Failed to join room" });
        }
      });

      socket.on("leave-room", async (data: { roomId: string; participantId: string }) => {
        try {
          const { roomId, participantId } = data;

          await this.roomService.leaveRoom(roomId, participantId);

          socket.leave(roomId);
          socket.to(roomId).emit("participant-left", { participantId });

          logger.info(`Client ${socket.id} left room ${roomId}`);
        } catch (error) {
          logger.error("Error in leave-room handler:", error);
        }
      });

      socket.on("toggle-media", (data: { roomId: string; participantId: string; type: "video" | "audio"; enabled: boolean }) => {
        const { roomId, participantId, type, enabled } = data;
        socket.to(roomId).emit("participant-media-toggle", { participantId, type, enabled });
      });

      socket.on("send-message", async (data: { roomId: string; message: any }) => {
        try {
          const { roomId, message } = data;

          // Salvar a mensagem no banco de dados
          await this.roomService.saveMessage(roomId, message.userId, message.userName, message.message);

          // Emitir a mensagem para todos os participantes da sala
          this.io.to(roomId).emit("new-message", message);
        } catch (error) {
          logger.error(`Error in send-message handler for room ${data.roomId}:`, error);
          socket.emit("room-error", { message: "Failed to send message" });
        }
      });

      socket.on("disconnect", () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }
}
