import { v4 as uuidv4 } from "uuid";
import MeetingModel from "../models/Meeting";
import { Meeting, MeetingCreationParams, Participant } from "../types/meeting";
import logger from "../config/logger";
import mongoose from "mongoose";

export class MeetingService {
  private generateRoomId(): string {
    // Gera um ID no formato bhy-ekyx-fke (3-4-3 caracteres)
    const id = uuidv4().replace(/-/g, "");
    const part1 = id.substring(0, 3);
    const part2 = id.substring(3, 7);
    const part3 = id.substring(7, 10);
    return `${part1}-${part2}-${part3}`.toLowerCase();
  }

  // Método para verificar se a reunião está disponível
  private isMeetingAvailable(meeting: any): boolean {
    const now = new Date();
    const startTime = meeting.startTime;
    const endTime = meeting.endTime;
    const isActive = meeting.isActive;

    if (!isActive) {
      return false;
    }

    const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60000);
    return now >= fiveMinutesBefore && (!endTime || now <= endTime);
  }

  async createMeeting(params: MeetingCreationParams): Promise<Meeting> {
    try {
      const roomId = this.generateRoomId();

      const meeting = new MeetingModel({
        roomId,
        hostId: params.hostId,
        startTime: params.startTime,
        endTime: params.endTime,
        participants: [],
        isActive: true,
      });

      await meeting.save();
      logger.info(`Meeting created with roomId: ${roomId}`);

      return meeting.toObject();
    } catch (error) {
      logger.error("Error creating meeting:", error);
      throw error;
    }
  }

  async getMeeting(roomId: string): Promise<Meeting | null> {
    try {
      const meeting = await MeetingModel.findOne({ roomId });
      return meeting ? meeting.toObject() : null;
    } catch (error) {
      logger.error(`Error getting meeting ${roomId}:`, error);
      throw error;
    }
  }

  async addParticipant(roomId: string, participant: Participant): Promise<Meeting | null> {
    try {
      const meeting = await MeetingModel.findOne({ roomId });

      if (!meeting) {
        logger.warn(`Meeting ${roomId} not found`);
        return null;
      }

      // Verificar se a reunião está disponível
      if (!this.isMeetingAvailable(meeting)) {
        logger.warn(`Meeting ${roomId} is not available`);
        return null;
      }

      // Encontrar participante existente
      const existingParticipantIndex = meeting.participants.findIndex((p) => p.id === participant.id);

      if (existingParticipantIndex >= 0) {
        // Atualizar participante existente
        meeting.participants[existingParticipantIndex].socketId = participant.socketId;
        meeting.participants[existingParticipantIndex].isVideoEnabled = participant.isVideoEnabled;
        meeting.participants[existingParticipantIndex].isAudioEnabled = participant.isAudioEnabled;
      } else {
        // Adicionar novo participante
        meeting.participants.push(participant);
      }

      await meeting.save();
      logger.info(`Participant ${participant.id} added/updated in meeting ${roomId}`);

      return meeting.toObject();
    } catch (error) {
      logger.error(`Error adding participant to meeting ${roomId}:`, error);
      throw error;
    }
  }

  async removeParticipant(roomId: string, participantId: string): Promise<Meeting | null> {
    try {
      const meeting = await MeetingModel.findOne({ roomId });

      if (!meeting) {
        return null;
      }

      meeting.participants = meeting.participants.filter((p) => p.id !== participantId);
      await meeting.save();
      logger.info(`Participant ${participantId} removed from meeting ${roomId}`);

      return meeting.toObject();
    } catch (error) {
      logger.error(`Error removing participant from meeting ${roomId}:`, error);
      throw error;
    }
  }

  async endMeeting(roomId: string): Promise<Meeting | null> {
    try {
      const meeting = await MeetingModel.findOne({ roomId });

      if (!meeting) {
        return null;
      }

      meeting.isActive = false;
      meeting.endTime = new Date();
      await meeting.save();
      logger.info(`Meeting ${roomId} ended`);

      return meeting.toObject();
    } catch (error) {
      logger.error(`Error ending meeting ${roomId}:`, error);
      throw error;
    }
  }
}
