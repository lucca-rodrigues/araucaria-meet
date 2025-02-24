import mongoose from "mongoose";
import { Room, Participant } from "../../../modules/rooms/interfaces/room.interface";

export interface RoomDocument extends mongoose.Document, Omit<Room, "id"> {}

const participantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userName: { type: String, required: true },
  isVideoEnabled: { type: Boolean, default: false },
  isAudioEnabled: { type: Boolean, default: false },
  socketId: { type: String },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    hostId: {
      type: String,
      required: true,
    },
    participants: [participantSchema],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model<RoomDocument>("Room", roomSchema);

export default RoomModel;
