import { RoomUseCases } from "./room.useCases";
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto, EndRoomDto, ScheduleRoomDto, SaveMessageDto, GetMessagesDto } from "./dto/room.dto";
import { Room, Participant, Message } from "./interfaces/room.interface";
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

  async scheduleRoom(
    owner: string,
    scheduleUsers: string[],
    scheduleDate: Date,
    scheduleDateEnd: Date,
    scheduleTitle: string,
    scheduleDescription: string
  ): Promise<Room> {
    try {
      const scheduleRoomDto = new ScheduleRoomDto(owner, scheduleUsers, scheduleDate, scheduleDateEnd, scheduleTitle, scheduleDescription);

      return await this.roomUseCases.scheduleRoom(scheduleRoomDto);
    } catch (error) {
      logger.error("Error in scheduleRoom service:", error);
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

  async saveMessage(roomId: string, userId: string, userName: string, content: string): Promise<Message> {
    try {
      const saveMessageDto = new SaveMessageDto(roomId, userId, userName, content);
      return await this.roomUseCases.saveMessage(saveMessageDto);
    } catch (error) {
      logger.error(`Error in saveMessage service for room ${roomId}:`, error);
      throw error;
    }
  }

  async getMessages(roomId: string): Promise<Message[]> {
    try {
      const getMessagesDto: GetMessagesDto = { roomId };
      return await this.roomUseCases.getMessages(getMessagesDto);
    } catch (error) {
      logger.error(`Error getting messages for room ${roomId}:`, error);
      throw error;
    }
  }

  async getAllRooms(): Promise<Room[]> {
    try {
      return await this.roomUseCases.getAllRooms();
    } catch (error) {
      logger.error("Error getting all rooms:", error);
      throw error;
    }
  }
}
