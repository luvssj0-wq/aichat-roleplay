import mongoose, { Schema, Document } from 'mongoose'

export interface IMemoryEntry extends Document {
  chatId: string
  characterId?: string
  content: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  embedding?: number[]
  relatedMemories: string[]
  createdAt: Date
  updatedAt: Date
  source: 'user' | 'ai' | 'system'
  context?: string
}

const MemoryEntrySchema = new Schema<IMemoryEntry>(
  {
    chatId: { type: String, required: true, index: true },
    characterId: { type: String, index: true },
    content: { type: String, required: true },
    importance: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    tags: { type: [String], default: [] },
    embedding: { type: [Number], sparse: true },
    relatedMemories: { type: [String], default: [] },
    source: { type: String, enum: ['user', 'ai', 'system'], default: 'ai' },
    context: { type: String },
  },
  {
    timestamps: true,
  }
)

// Índice compuesto para búsquedas eficientes
MemoryEntrySchema.index({ chatId: 1, importance: 1, createdAt: -1 })
MemoryEntrySchema.index({ chatId: 1, tags: 1 })

export default mongoose.model<IMemoryEntry>('MemoryEntry', MemoryEntrySchema)
