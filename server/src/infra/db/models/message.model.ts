import mongoose from "mongoose";
import { Message } from "../../../modules/rooms/interfaces/room.interface";

export interface MessageDocument extends mongoose.Document, Omit<Message, "id"> {}

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice composto para consultas de mensagens por sala
messageSchema.index({ roomId: 1, timestamp: 1 });

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);

export default MessageModel;
