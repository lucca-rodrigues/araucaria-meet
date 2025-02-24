import { Room, Participant, RoomRepository } from "../../../modules/rooms/interfaces/room.interface";
import logger from "../../../config/logger";

/**
 * Implementação de repositório em memória para uso em desenvolvimento ou quando MongoDB não está disponível
 */
export class InMemoryRoomRepository implements RoomRepository {
  private rooms: Map<string, Room> = new Map();

  async create(room: Partial<Room>): Promise<Room> {
    if (!room.roomId) {
      throw new Error("Room ID is required");
    }

    const now = new Date();
    const newRoom: Room = {
      roomId: room.roomId,
      hostId: room.hostId || "",
      participants: room.participants || [],
      startTime: room.startTime || now,
      endTime: room.endTime,
      isActive: room.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    this.rooms.set(newRoom.roomId, newRoom);
    logger.info(`Room created with ID: ${newRoom.roomId} (in-memory)`);

    return newRoom;
  }

  async findByRoomId(roomId: string): Promise<Room | null> {
    const room = this.rooms.get(roomId);
    return room || null;
  }

  async update(roomId: string, data: Partial<Room>): Promise<Room | null> {
    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    const updatedRoom: Room = {
      ...room,
      ...data,
      updatedAt: new Date(),
    };

    this.rooms.set(roomId, updatedRoom);
    return updatedRoom;
  }

  async addParticipant(roomId: string, participant: Participant): Promise<Room | null> {
    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    const existingParticipantIndex = room.participants.findIndex((p) => p.id === participant.id);

    if (existingParticipantIndex >= 0) {
      room.participants[existingParticipantIndex] = {
        ...room.participants[existingParticipantIndex],
        ...participant,
      };
    } else {
      room.participants.push(participant);
    }

    room.updatedAt = new Date();
    logger.info(`Participant ${participant.id} added to room ${roomId} (in-memory)`);

    return room;
  }

  async removeParticipant(roomId: string, participantId: string): Promise<Room | null> {
    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    room.participants = room.participants.filter((p) => p.id !== participantId);
    room.updatedAt = new Date();
    logger.info(`Participant ${participantId} removed from room ${roomId} (in-memory)`);

    return room;
  }

  async endRoom(roomId: string): Promise<Room | null> {
    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    room.isActive = false;
    room.endTime = new Date();
    room.updatedAt = new Date();
    logger.info(`Room ${roomId} ended (in-memory)`);

    return room;
  }
}
