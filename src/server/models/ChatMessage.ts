import mongoose, { Schema, Document } from 'mongoose'
import { Message } from '@types/index'

export interface IChatMessage extends Document {
  chatId: string
  messages: Message[]
  totalMessages: number
  lastMessageAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatId: { type: String, required: true, unique: true, index: true },
    messages: { type: Array, default: [] },
    totalMessages: { type: Number, default: 0 },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)
