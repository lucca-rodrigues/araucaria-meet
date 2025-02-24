import { Room, Participant, RoomRepository } from "../../../modules/rooms/interfaces/room.interface";
import RoomModel from "../models/room.model";
import logger from "../../../config/logger";
import { isConnected } from "../config/db.config";

export class MongoDBRoomRepository implements RoomRepository {
  async create(room: Partial<Room>): Promise<Room> {
    try {
      if (!isConnected()) {
        throw new Error("MongoDB is not connected");
      }

      const newRoom = new RoomModel(room);
      await newRoom.save();
      logger.info(`Room created with ID: ${room.roomId}`);

      return newRoom.toObject();
    } catch (error) {
      logger.error("Error creating room:", error);
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<Room | null> {
    try {
      if (!isConnected()) {
        throw new Error("MongoDB is not connected");
      }

      const room = await RoomModel.findOne({ roomId });
      return room ? room.toObject() : null;
    } catch (error) {
      logger.error(`Error finding room ${roomId}:`, error);
      throw error;
    }
  }

  async update(roomId: string, data: Partial<Room>): Promise<Room | null> {
    try {
      if (!isConnected()) {
        throw new Error("MongoDB is not connected");
      }

      const room = await RoomModel.findOneAndUpdate({ roomId }, { $set: data }, { new: true });

      return room ? room.toObject() : null;
    } catch (error) {
      logger.error(`Error updating room ${roomId}:`, error);
      throw error;
    }
  }

  async addParticipant(roomId: string, participant: Participant): Promise<Room | null> {
    try {
      if (!isConnected()) {
        throw new Error("MongoDB is not connected");
      }

      const room = await RoomModel.findOne({ roomId });

      if (!room) {
        return null;
      }

      const existingParticipantIndex = room.participants.findIndex((p) => p.id === participant.id);

      if (existingParticipantIndex >= 0) {
        // Atualizar participante existente
        room.participants[existingParticipantIndex].socketId = participant.socketId;
        room.participants[existingParticipantIndex].isVideoEnabled = participant.isVideoEnabled;
        room.participants[existingParticipantIndex].isAudioEnabled = participant.isAudioEnabled;
      } else {
        // Adicionar novo participante
        room.participants.push(participant);
      }

      await room.save();
      logger.info(`Participant ${participant.id} added to room ${roomId}`);

      return room.toObject();
    } catch (error) {
      logger.error(`Error adding participant to room ${roomId}:`, error);
      throw error;
    }
  }

  async removeParticipant(roomId: string, participantId: string): Promise<Room | null> {
    try {
      if (!isConnected()) {
        throw new Error("MongoDB is not connected");
      }

      const room = await RoomModel.findOne({ roomId });

      if (!room) {
        return null;
      }

      room.participants = room.participants.filter((p) => p.id !== participantId);
      await room.save();
      logger.info(`Participant ${participantId} removed from room ${roomId}`);

      return room.toObject();
    } catch (error) {
      logger.error(`Error removing participant from room ${roomId}:`, error);
      throw error;
    }
  }

  async endRoom(roomId: string): Promise<Room | null> {
    try {
      if (!isConnected()) {
        throw new Error("MongoDB is not connected");
      }

      const room = await RoomModel.findOneAndUpdate(
        { roomId },
        {
          $set: {
            isActive: false,
            endTime: new Date(),
          },
        },
        { new: true }
      );

      logger.info(`Room ${roomId} ended`);
      return room ? room.toObject() : null;
    } catch (error) {
      logger.error(`Error ending room ${roomId}:`, error);
      throw error;
    }
  }
}
