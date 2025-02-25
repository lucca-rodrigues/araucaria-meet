import { Request, Response } from "express";
import { RoomService } from "./room.service";
import logger from "../../config/logger";

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  async createRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { hostId, startTime, endTime } = req.body;

      if (!hostId || !startTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const room = await this.roomService.createRoom(hostId, new Date(startTime), endTime ? new Date(endTime) : undefined);

      return res.status(201).json(room);
    } catch (error) {
      logger.error("Error in createRoom controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async scheduleRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { owner, schedule_users, schedule_date, schedule_date_end, schedule_title, schedule_description } = req.body;

      // Verificar campos obrigatórios
      if (!owner || !schedule_date || !schedule_date_end || !schedule_title) {
        return res.status(400).json({
          error: "Missing required fields",
          requiredFields: ["owner", "schedule_date", "schedule_date_end", "schedule_title"],
        });
      }

      // Converter strings de data para objetos Date
      let startDate: Date;
      let endDate: Date;

      try {
        // Log para depuração
        logger.info(`Dados recebidos para agendamento: data início=${schedule_date}, data fim=${schedule_date_end}`);

        // Tentativa de parse de data no formato DD/MM/YYYY HH:MM
        if (typeof schedule_date === "string" && schedule_date.includes("/")) {
          const [datePart, timePart] = schedule_date.split(" ");
          const [day, month, year] = datePart.split("/");
          const dateString = `${year}-${month}-${day}T${timePart || "00:00"}`;
          startDate = new Date(dateString);
          logger.info(`Data início parseada: ${startDate.toISOString()}`);
        } else {
          startDate = new Date(schedule_date);
        }

        if (typeof schedule_date_end === "string" && schedule_date_end.includes("/")) {
          const [datePart, timePart] = schedule_date_end.split(" ");
          const [day, month, year] = datePart.split("/");
          const dateString = `${year}-${month}-${day}T${timePart || "00:00"}`;
          endDate = new Date(dateString);
          logger.info(`Data fim parseada: ${endDate.toISOString()}`);
        } else {
          endDate = new Date(schedule_date_end);
        }

        // Criar nova sala para testes imediatos (pode ser removido depois)
        if (startDate.getTime() > Date.now() + 3600000) {
          // Se a data de início for mais de 1h no futuro
          logger.info("Ajustando horário para permitir testes imediatos");
          const now = new Date();
          startDate = new Date(now.getTime() - 10 * 60000); // 10 minutos atrás
          endDate = new Date(now.getTime() + 60 * 60000); // 1 hora à frente
        }
      } catch (error: any) {
        logger.error("Erro na conversão de datas:", error);
        return res.status(400).json({
          error: "Invalid date format. Please use DD/MM/YYYY HH:MM or ISO format.",
          details: error.message,
        });
      }

      // Verificar se as datas são válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      // Verificar se a data de início é anterior à data de fim
      if (startDate >= endDate) {
        return res.status(400).json({ error: "End date must be after start date" });
      }

      const room = await this.roomService.scheduleRoom(owner, schedule_users || [], startDate, endDate, schedule_title, schedule_description || "");

      return res.status(201).json(room);
    } catch (error) {
      logger.error("Error in scheduleRoom controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Cria uma sala para teste com horário atual
   */
  async createTestRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { hostId, userName } = req.body;

      if (!hostId) {
        return res.status(400).json({ error: "Host ID is required" });
      }

      // Cria uma sala com horário que permite acesso imediato
      const now = new Date();
      const startTime = new Date(now.getTime() - 10 * 60000); // 10 minutos atrás
      const endTime = new Date(now.getTime() + 60 * 60000); // 1 hora à frente

      const room = await this.roomService.createRoom(hostId, startTime, endTime);

      return res.status(201).json({
        ...room,
        message: "Esta sala foi criada com horário ajustado para permitir acesso imediato",
      });
    } catch (error) {
      logger.error("Error in createTestRoom controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRoomById(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
      }

      const room = await this.roomService.getRoomById(roomId);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.status(200).json(room);
    } catch (error) {
      logger.error(`Error in getRoomById controller for room ${req.params.roomId}:`, error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async joinRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const { participant } = req.body;

      if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
      }

      if (!participant || !participant.id || !participant.userName) {
        return res.status(400).json({ error: "Participant data is incomplete" });
      }

      const room = await this.roomService.joinRoom(roomId, participant);

      if (!room) {
        return res.status(404).json({ error: "Room not found or not available" });
      }

      return res.status(200).json(room);
    } catch (error) {
      logger.error(`Error in joinRoom controller for room ${req.params.roomId}:`, error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async leaveRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const { participantId } = req.body;

      if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
      }

      if (!participantId) {
        return res.status(400).json({ error: "Participant ID is required" });
      }

      const room = await this.roomService.leaveRoom(roomId, participantId);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.status(200).json(room);
    } catch (error) {
      logger.error(`Error in leaveRoom controller for room ${req.params.roomId}:`, error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async endRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
      }

      const room = await this.roomService.endRoom(roomId);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.status(200).json(room);
    } catch (error) {
      logger.error(`Error in endRoom controller for room ${req.params.roomId}:`, error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        res.status(400).json({ error: "Room ID is required" });
        return;
      }

      const messages = await this.roomService.getMessages(roomId);
      res.status(200).json(messages);
    } catch (error) {
      logger.error("Error getting messages:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  }

  async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error) {
      logger.error("Error getting all rooms:", error);
      res.status(500).json({ error: "Failed to get rooms" });
    }
  }
}
