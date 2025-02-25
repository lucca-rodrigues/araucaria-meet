import HttpClient from '@infra/httpRequest';
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Participant {
  id: string;
  userName: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  socketId?: string;
  email?: string;
}

export interface ScheduleInfo {
  title: string;
  description: string;
  owner: string;
  scheduleUsers: string[];
}

export interface Room {
  roomId: string;
  hostId: string;
  participants: Participant[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  scheduleInfo?: ScheduleInfo;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

class APIService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(API_URL);
  }

  // Cria uma nova sala
  async createRoom(
    userName: string,
    isVideoEnabled: boolean,
    isAudioEnabled: boolean
  ): Promise<Room> {
    const userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', userId);

    const participant: Participant = {
      id: userId,
      userName,
      isVideoEnabled,
      isAudioEnabled,
    };

    const response = await this.httpClient.post('/rooms', {
      hostId: userId,
      userName,
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
      participant,
    });

    return response?.data;
  }

  // Agenda uma nova sala
  async scheduleRoom(
    owner: string,
    scheduleUsers: string[],
    scheduleDate: Date | string,
    scheduleDateEnd: Date | string,
    scheduleTitle: string,
    scheduleDescription: string
  ): Promise<Room> {
    const response = await this.httpClient.post('/rooms/schedule', {
      owner,
      schedule_users: scheduleUsers,
      schedule_date: scheduleDate,
      schedule_date_end: scheduleDateEnd,
      schedule_title: scheduleTitle,
      schedule_description: scheduleDescription,
    });

    return response?.data;
  }

  // Obtém detalhes de uma sala por ID
  async getRoomById(roomId: string): Promise<Room> {
    const response = await this.httpClient.get(`/rooms/${roomId}`);
    return response?.data;
  }

  // Participante entra em uma sala
  async joinRoom(
    roomId: string,
    userName: string,
    isVideoEnabled: boolean,
    isAudioEnabled: boolean,
    email?: string
  ): Promise<Room> {
    const userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', userId);

    const participant: Participant = {
      id: userId,
      userName,
      isVideoEnabled,
      isAudioEnabled,
      email,
    };

    const response = await this.httpClient.post(`/rooms/${roomId}/join`, {
      participant,
    });

    return response?.data;
  }

  // Participante sai de uma sala
  async leaveRoom(roomId: string): Promise<Room> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await this.httpClient.post(`/rooms/${roomId}/leave`, {
      participantId: userId,
    });

    return response?.data;
  }

  // Finaliza uma sala (apenas o host pode fazer isso)
  async endRoom(roomId: string): Promise<Room> {
    const response = await this.httpClient.post(`/rooms/${roomId}/end`);
    return response?.data;
  }

  // Obtém as mensagens de uma sala
  async getMessages(roomId: string): Promise<Message[]> {
    const response = await this.httpClient.get(`/rooms/${roomId}/messages`);
    return response?.data;
  }
}

export default new APIService();
