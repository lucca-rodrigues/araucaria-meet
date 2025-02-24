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
}
