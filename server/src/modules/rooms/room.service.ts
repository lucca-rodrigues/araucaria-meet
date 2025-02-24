import { RoomUseCases } from "./room.useCases";
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto, EndRoomDto } from "./dto/room.dto";
import { Room, Participant } from "./interfaces/room.interface";
import logger from "../../config/logger";

export class RoomService {
  constructor(private readonly roomUseCases: RoomUseCases) {}

  async createRoom(hostId: string, startTime: Date, endTime?: Date): Promise<Room> {
    try {
      const createRoomDto = new CreateRoomDto(hostId, startTime, endTime);
      return await this.roomUseCases.createRoom(createRoomDto);
    } catch (error) {
      logger.error("Error in createRoom service:", error);
      throw error;
    }
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    try {
      return await this.roomUseCases.getRoomById(roomId);
    } catch (error) {
      logger.error(`Error in getRoomById service for room ${roomId}:`, error);
      throw error;
    }
  }

  async joinRoom(roomId: string, participant: Participant): Promise<Room | null> {
    try {
      const joinRoomDto = new JoinRoomDto(roomId, participant);
      return await this.roomUseCases.joinRoom(joinRoomDto);
    } catch (error) {
      logger.error(`Error in joinRoom service for room ${roomId}:`, error);
      throw error;
    }
  }

  async leaveRoom(roomId: string, participantId: string): Promise<Room | null> {
    try {
      const leaveRoomDto = new LeaveRoomDto(roomId, participantId);
      return await this.roomUseCases.leaveRoom(leaveRoomDto);
    } catch (error) {
      logger.error(`Error in leaveRoom service for room ${roomId}:`, error);
      throw error;
    }
  }

  async endRoom(roomId: string): Promise<Room | null> {
    try {
      const endRoomDto = new EndRoomDto(roomId);
      return await this.roomUseCases.endRoom(endRoomDto);
    } catch (error) {
      logger.error(`Error in endRoom service for room ${roomId}:`, error);
      throw error;
    }
  }
}
