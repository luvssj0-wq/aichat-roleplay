import mongoose, { Schema, Document } from 'mongoose'

export interface IConversationSnapshot extends Document {
  chatId: string
  messageCount: number
  snapshot: {
    content: string
    timestamp: Date
    type: 'full' | 'summary' | 'highlight'
  }
  extractedData: {
    locations: string[]
    characters: string[]
    events: string[]
    decisions: string[]
  }
}

const ConversationSnapshotSchema = new Schema<IConversationSnapshot>(
  {
    chatId: { type: String, required: true, index: true },
    messageCount: { type: Number, required: true },
    snapshot: {
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      type: { type: String, enum: ['full', 'summary', 'highlight'], default: 'summary' },
    },
    extractedData: {
      locations: { type: [String], default: [] },
      characters: { type: [String], default: [] },
      events: { type: [String], default: [] },
      decisions: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IConversationSnapshot>(
  'ConversationSnapshot',
  ConversationSnapshotSchema
)
