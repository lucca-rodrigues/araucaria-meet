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
  owner: string; // email
  scheduleUsers: string[]; // lista de emails
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

export interface RoomRepository {
  create(room: Partial<Room>): Promise<Room>;
  findByRoomId(roomId: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  update(roomId: string, data: Partial<Room>): Promise<Room | null>;
  addParticipant(roomId: string, participant: Participant): Promise<Room | null>;
  removeParticipant(roomId: string, participantId: string): Promise<Room | null>;
  endRoom(roomId: string): Promise<Room | null>;
  saveMessage(roomId: string, message: Message): Promise<Message>;
  getMessages(roomId: string): Promise<Message[]>;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}
