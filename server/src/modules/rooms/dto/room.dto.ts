import { Participant, ScheduleInfo } from "../interfaces/room.interface";

export class CreateRoomDto {
  constructor(public hostId: string, public startTime: Date, public endTime?: Date, public scheduleInfo?: ScheduleInfo) {}
}

export class ScheduleRoomDto {
  constructor(
    public owner: string,
    public scheduleUsers: string[],
    public scheduleDate: Date,
    public scheduleDateEnd: Date,
    public scheduleTitle: string,
    public scheduleDescription: string
  ) {}
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

export class SaveMessageDto {
  constructor(public roomId: string, public userId: string, public userName: string, public content: string) {}
}

export class GetMessagesDto {
  constructor(public roomId: string) {}
}
