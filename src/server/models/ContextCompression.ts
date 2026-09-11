import mongoose, { Schema, Document } from 'mongoose'

export interface IContextCompression extends Document {
  chatId: string
  originalLength: number
  compressedLength: number
  summary: string
  keyPoints: string[]
  timestamp: Date
  version: number
}

const ContextCompressionSchema = new Schema<IContextCompression>(
  {
    chatId: { type: String, required: true, index: true },
    originalLength: { type: Number, required: true },
    compressedLength: { type: Number, required: true },
    summary: { type: String, required: true },
    keyPoints: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IContextCompression>(
  'ContextCompression',
  ContextCompressionSchema
)
