import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { MeetingService } from "./MeetingService";
import logger from "../config/logger";

export class WebSocketManager {
  private io: SocketIOServer;
  private meetingService: MeetingService;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });
    this.meetingService = new MeetingService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on("join-room", async (data: { roomId: string; participant: any }) => {
        try {
          const { roomId, participant } = data;

          // Adiciona o socketId ao participante
          participant.socketId = socket.id;

          // Adiciona o participante à sala
          const meeting = await this.meetingService.addParticipant(roomId, participant);

          if (!meeting) {
            socket.emit("room-error", { message: "Room not found or not available" });
            return;
          }

          // Entra na sala do Socket.IO
          socket.join(roomId);

          // Notifica outros participantes
          socket.to(roomId).emit("participant-joined", participant);

          // Envia lista de participantes atual
          socket.emit("room-participants", meeting.participants);

          logger.info(`Client ${socket.id} joined room ${roomId}`);
        } catch (error) {
          logger.error("Error in join-room handler:", error);
          socket.emit("room-error", { message: "Failed to join room" });
        }
      });

      socket.on("leave-room", async (data: { roomId: string; participantId: string }) => {
        try {
          const { roomId, participantId } = data;

          await this.meetingService.removeParticipant(roomId, participantId);

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

      socket.on("send-message", (data: { roomId: string; message: any }) => {
        const { roomId, message } = data;
        this.io.to(roomId).emit("new-message", message);
      });

      socket.on("disconnect", () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }
}
