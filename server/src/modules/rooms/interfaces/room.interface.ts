export interface Participant {
  id: string;
  userName: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  socketId?: string;
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
}

export interface RoomRepository {
  create(room: Partial<Room>): Promise<Room>;
  findByRoomId(roomId: string): Promise<Room | null>;
  update(roomId: string, data: Partial<Room>): Promise<Room | null>;
  addParticipant(roomId: string, participant: Participant): Promise<Room | null>;
  removeParticipant(roomId: string, participantId: string): Promise<Room | null>;
  endRoom(roomId: string): Promise<Room | null>;
}
