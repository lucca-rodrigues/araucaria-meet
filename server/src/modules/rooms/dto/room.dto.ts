import { Participant } from "../interfaces/room.interface";

export class CreateRoomDto {
  constructor(public hostId: string, public startTime: Date, public endTime?: Date) {}
}

export class JoinRoomDto {
  constructor(public roomId: string, public participant: Participant) {}
}

export class LeaveRoomDto {
  constructor(public roomId: string, public participantId: string) {}
}

export class EndRoomDto {
  constructor(public roomId: string) {}
}
