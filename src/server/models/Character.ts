import mongoose, { Schema, Document } from 'mongoose'
import { Character } from '@types/index'

export interface ICharacter extends Character, Document {}

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    image: { type: String },
    personality: { type: String, default: '' },
    appearance: { type: String, default: '' },
    history: { type: String, default: '' },
    profession: { type: String, default: '' },
    relationships: { type: String, default: '' },
    scenario: { type: String, default: '' },
    context: { type: String, default: '' },
    lore: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
    initialMessage: { type: String, default: '' },
    systemPrompt: { type: String, default: '' },
    temperature: { type: Number, default: 0.7, min: 0, max: 1 },
    tags: { type: [String], default: [] },
    isPublic: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['real', 'fictional', 'mixed'],
      default: 'fictional',
    },
    modelConfig: {
      model: { type: String, default: 'gpt-3.5-turbo' },
      maxTokens: { type: Number, default: 2048 },
      topP: { type: Number, default: 1 },
      frequencyPenalty: { type: Number, default: 0 },
      presencePenalty: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
)

// Índices para búsquedas
CharacterSchema.index({ userId: 1, createdAt: -1 })
CharacterSchema.index({ name: 'text', personality: 'text', tags: 'text' })

export default mongoose.model<ICharacter>('Character', CharacterSchema)
