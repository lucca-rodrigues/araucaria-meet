export interface Participant {
  id: string;
  userName: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  socketId?: string;
}

export interface Meeting {
  roomId: string;
  hostId: string;
  participants: Participant[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingCreationParams {
  hostId: string;
  startTime: Date;
  endTime?: Date;
}
