import mongoose from "mongoose";
import { Meeting, Participant } from "../types/meeting";

interface MeetingDocument extends mongoose.Document, Meeting {}

const participantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userName: { type: String, required: true },
  isVideoEnabled: { type: Boolean, default: false },
  isAudioEnabled: { type: Boolean, default: false },
  socketId: { type: String },
});

const meetingSchema = new mongoose.Schema(
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

const MeetingModel = mongoose.model<MeetingDocument>("Meeting", meetingSchema);

export default MeetingModel;
