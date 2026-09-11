import mongoose, { Schema, Document } from 'mongoose'

export interface ICharacterMemoryIndex extends Document {
  chatId: string
  characterId: string
  memories: Array<{
    memoryId: string
    importance: string
    relevanceScore: number
  }>
  lastUpdated: Date
}

const CharacterMemoryIndexSchema = new Schema<ICharacterMemoryIndex>(
  {
    chatId: { type: String, required: true, index: true },
    characterId: { type: String, required: true, index: true },
    memories: [
      {
        memoryId: String,
        importance: String,
        relevanceScore: Number,
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

CharacterMemoryIndexSchema.index({ chatId: 1, characterId: 1 })

export default mongoose.model<ICharacterMemoryIndex>(
  'CharacterMemoryIndex',
  CharacterMemoryIndexSchema
)
