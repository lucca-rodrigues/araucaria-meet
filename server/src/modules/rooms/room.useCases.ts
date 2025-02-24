import { Room, Participant, RoomRepository } from "./interfaces/room.interface";
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto, EndRoomDto } from "./dto/room.dto";
import { generateRoomId } from "./functions/roomId.generator";
import logger from "../../config/logger";

export class RoomUseCases {
  constructor(private readonly roomRepository: RoomRepository) {}

  /**
   * Cria uma nova sala de reunião
   */
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const roomId = generateRoomId();

      const room: Partial<Room> = {
        roomId,
        hostId: createRoomDto.hostId,
        startTime: createRoomDto.startTime,
        endTime: createRoomDto.endTime,
        participants: [],
        isActive: true,
      };

      return await this.roomRepository.create(room);
    } catch (error) {
      logger.error("Error in createRoom use case:", error);
      throw error;
    }
  }

  /**
   * Obtém os detalhes de uma sala pelo ID
   */
  async getRoomById(roomId: string): Promise<Room | null> {
    try {
      return await this.roomRepository.findByRoomId(roomId);
    } catch (error) {
      logger.error(`Error in getRoomById use case for room ${roomId}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se uma sala está disponível (5 min antes do início até o fim)
   */
  private isRoomAvailable(room: Room): boolean {
    const now = new Date();
    const fiveMinutesBefore = new Date(room.startTime.getTime() - 5 * 60000);

    return room.isActive && now >= fiveMinutesBefore && (!room.endTime || now <= room.endTime);
  }

  /**
   * Adiciona um participante a uma sala
   */
  async joinRoom(joinRoomDto: JoinRoomDto): Promise<Room | null> {
    try {
      const { roomId, participant } = joinRoomDto;

      const room = await this.roomRepository.findByRoomId(roomId);

      if (!room) {
        logger.warn(`Room ${roomId} not found`);
        return null;
      }

      if (!this.isRoomAvailable(room)) {
        logger.warn(`Room ${roomId} is not available`);
        return null;
      }

      return await this.roomRepository.addParticipant(roomId, participant);
    } catch (error) {
      logger.error(`Error in joinRoom use case for room ${joinRoomDto.roomId}:`, error);
      throw error;
    }
  }

  /**
   * Remove um participante de uma sala
   */
  async leaveRoom(leaveRoomDto: LeaveRoomDto): Promise<Room | null> {
    try {
      const { roomId, participantId } = leaveRoomDto;
      return await this.roomRepository.removeParticipant(roomId, participantId);
    } catch (error) {
      logger.error(`Error in leaveRoom use case for room ${leaveRoomDto.roomId}:`, error);
      throw error;
    }
  }

  /**
   * Finaliza uma sala de reunião
   */
  async endRoom(endRoomDto: EndRoomDto): Promise<Room | null> {
    try {
      const { roomId } = endRoomDto;
      return await this.roomRepository.endRoom(roomId);
    } catch (error) {
      logger.error(`Error in endRoom use case for room ${endRoomDto.roomId}:`, error);
      throw error;
    }
  }
}
