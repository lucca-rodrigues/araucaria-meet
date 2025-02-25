import { Room, Participant, RoomRepository, Message, ScheduleInfo } from "./interfaces/room.interface";
import { CreateRoomDto, JoinRoomDto, LeaveRoomDto, EndRoomDto, ScheduleRoomDto, SaveMessageDto, GetMessagesDto } from "./dto/room.dto";
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
        scheduleInfo: createRoomDto.scheduleInfo,
      };

      return await this.roomRepository.create(room);
    } catch (error) {
      logger.error("Error in createRoom use case:", error);
      throw error;
    }
  }

  /**
   * Agenda uma nova sala de reunião
   */
  async scheduleRoom(scheduleRoomDto: ScheduleRoomDto): Promise<Room> {
    try {
      const roomId = generateRoomId();

      // Configura as informações de agendamento
      const scheduleInfo: ScheduleInfo = {
        title: scheduleRoomDto.scheduleTitle,
        description: scheduleRoomDto.scheduleDescription,
        owner: scheduleRoomDto.owner,
        scheduleUsers: scheduleRoomDto.scheduleUsers,
      };

      // Cria a sala com as informações de agendamento
      const room: Partial<Room> = {
        roomId,
        hostId: scheduleRoomDto.owner, // O criador é o owner
        startTime: scheduleRoomDto.scheduleDate,
        endTime: scheduleRoomDto.scheduleDateEnd,
        participants: [],
        isActive: true,
        scheduleInfo,
      };

      return await this.roomRepository.create(room);
    } catch (error) {
      logger.error("Error in scheduleRoom use case:", error);
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
    // Obtém o horário atual em UTC para garantir consistência na comparação
    const nowUtc = new Date();

    // Calcula 5 minutos antes do início da sala
    const fiveMinutesBefore = new Date(room.startTime.getTime() - 5 * 60000);

    // Compara utilizando timestamps para evitar problemas de timezone
    return room.isActive && nowUtc.getTime() >= fiveMinutesBefore.getTime() && (!room.endTime || nowUtc.getTime() <= room.endTime.getTime());
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

  /**
   * Salva uma mensagem na sala
   */
  async saveMessage(saveMessageDto: SaveMessageDto): Promise<Message> {
    try {
      const { roomId, userId, userName, content } = saveMessageDto;

      const message: Message = {
        id: "", // Será gerado pelo repositório
        roomId,
        userId,
        userName,
        content,
        timestamp: new Date(),
      };

      return await this.roomRepository.saveMessage(roomId, message);
    } catch (error) {
      logger.error(`Error in saveMessage use case for room ${saveMessageDto.roomId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém as mensagens de uma sala
   */
  async getMessages(getMessagesDto: GetMessagesDto): Promise<Message[]> {
    try {
      const { roomId } = getMessagesDto;
      return await this.roomRepository.getMessages(roomId);
    } catch (error) {
      logger.error(`Error getting messages for room ${getMessagesDto.roomId}:`, error);
      throw error;
    }
  }

  async getAllRooms(): Promise<Room[]> {
    try {
      return await this.roomRepository.findAll();
    } catch (error) {
      logger.error("Error getting all rooms:", error);
      throw error;
    }
  }
}
