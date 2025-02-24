import { Request, Response } from "express";
import { MeetingService } from "../services/MeetingService";
import logger from "../config/logger";

export class MeetingController {
  private meetingService: MeetingService;

  constructor() {
    this.meetingService = new MeetingService();
  }

  async createMeeting(req: Request, res: Response) {
    try {
      const { hostId, startTime, endTime } = req.body;

      if (!hostId || !startTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const meeting = await this.meetingService.createMeeting({
        hostId,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : undefined,
      });

      return res.status(201).json(meeting);
    } catch (error) {
      logger.error("Error in createMeeting controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMeeting(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
      }

      const meeting = await this.meetingService.getMeeting(roomId);

      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }

      return res.json(meeting);
    } catch (error) {
      logger.error("Error in getMeeting controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async endMeeting(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
      }

      const meeting = await this.meetingService.endMeeting(roomId);

      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }

      return res.json(meeting);
    } catch (error) {
      logger.error("Error in endMeeting controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
