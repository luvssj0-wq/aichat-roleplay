import MemoryEntry from '../models/MemoryEntry'
import CharacterMemoryIndex from '../models/CharacterMemoryIndex'
import EmbeddingService from './EmbeddingService'
import { Message } from '@types/index'

export class MemoryService {
  /**
   * Almacena un nuevo recuerdo en la base de datos
   */
  async storeMemory(
    chatId: string,
    content: string,
    importance: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    characterId?: string,
    tags: string[] = [],
    source: 'user' | 'ai' | 'system' = 'ai'
  ) {
    try {
      const embedding = await EmbeddingService.generateEmbedding(content)
      
      const memoryEntry = new MemoryEntry({
        chatId,
        characterId,
        content,
        importance,
        tags,
        embedding,
        source,
      })

      const savedMemory = await memoryEntry.save()

      // Actualizar índice de memoria del personaje si existe
      if (characterId) {
        await this.updateCharacterMemoryIndex(chatId, characterId, savedMemory._id.toString())
      }

      return savedMemory
    } catch (error) {
      console.error('Error storing memory:', error)
      throw error
    }
  }

  /**
   * Recupera recuerdos relevantes basado en similitud semántica
   */
  async retrieveRelevantMemories(
    chatId: string,
    query: string,
    limit: number = 10,
    characterId?: string
  ) {
    try {
      const queryEmbedding = await EmbeddingService.generateEmbedding(query)

      // Buscar en memoria
      const filter: any = { chatId }
      if (characterId) {
        filter.characterId = characterId
      }

      const allMemories = await MemoryEntry.find(filter)
        .sort({ importance: -1, createdAt: -1 })
        .limit(100)

      // Calcular similitud y ordenar
      const rankedMemories = allMemories
        .map((memory) => ({
          ...memory.toObject(),
          relevanceScore: memory.embedding
            ? EmbeddingService.cosineSimilarity(queryEmbedding, memory.embedding)
            : 0,
        }))
        .sort((a, b) => {
          // Priorizar por importancia y relevancia
          const importanceScore = { critical: 4, high: 3, medium: 2, low: 1 }
          const aScore =
            (importanceScore[a.importance as keyof typeof importanceScore] || 0) *
            0.5 +
            a.relevanceScore * 0.5
          const bScore =
            (importanceScore[b.importance as keyof typeof importanceScore] || 0) *
            0.5 +
            b.relevanceScore * 0.5
          return bScore - aScore
        })
        .slice(0, limit)

      return rankedMemories
    } catch (error) {
      console.error('Error retrieving memories:', error)
      return []
    }
  }

  /**
   * Extrae información importante de un mensaje
   */
  async extractImportantData(message: string): Promise<{
    importance: 'low' | 'medium' | 'high' | 'critical'
    tags: string[]
  }> {
    // Palabras clave de importancia alta
    const criticalKeywords = [
      'muere',
      'muerte',
      'secreto',
      'descubre',
      'verdad',
      'traición',
      'traidor',
      'poder',
      'maldición',
      'promesa',
      'jura',
    ]
    const highKeywords = [
      'amor',
      'odio',
      'miedo',
      'confianza',
      'enemigo',
      'aliado',
      'familia',
      'objetivo',
      'misión',
      'destino',
    ]

    let importance: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    const tags: string[] = []

    const lowerMessage = message.toLowerCase()

    if (criticalKeywords.some((kw) => lowerMessage.includes(kw))) {
      importance = 'critical'
    } else if (highKeywords.some((kw) => lowerMessage.includes(kw))) {
      importance = 'high'
    }

    // Extraer tags
    if (lowerMessage.includes('relación') || lowerMessage.includes('personaje')) {
      tags.push('relationship')
    }
    if (lowerMessage.includes('lugar') || lowerMessage.includes('ubicación')) {
      tags.push('location')
    }
    if (lowerMessage.includes('objeto') || lowerMessage.includes('artículo')) {
      tags.push('item')
    }
    if (lowerMessage.includes('evento') || lowerMessage.includes('acontecimiento')) {
      tags.push('event')
    }
    if (lowerMessage.includes('decisión') || lowerMessage.includes('decisiones')) {
      tags.push('decision')
    }

    return { importance, tags }
  }

  /**
   * Actualiza el índice de memoria del personaje
   */
  async updateCharacterMemoryIndex(
    chatId: string,
    characterId: string,
    memoryId: string
  ) {
    try {
      const index = await CharacterMemoryIndex.findOne({
        chatId,
        characterId,
      })

      if (index) {
        // Limitar a 1000 memorias por personaje para rendimiento
        if (index.memories.length >= 1000) {
          index.memories.shift()
        }
        index.memories.push({
          memoryId,
          importance: 'medium',
          relevanceScore: 0.5,
        })
        index.lastUpdated = new Date()
        await index.save()
      } else {
        await CharacterMemoryIndex.create({
          chatId,
          characterId,
          memories: [{ memoryId, importance: 'medium', relevanceScore: 0.5 }],
        })
      }
    } catch (error) {
      console.error('Error updating character memory index:', error)
    }
  }

  /**
   * Obtiene el total de memorias en un chat
   */
  async getMemoryCount(chatId: string, characterId?: string): Promise<number> {
    try {
      const filter: any = { chatId }
      if (characterId) {
        filter.characterId = characterId
      }
      return await MemoryEntry.countDocuments(filter)
    } catch (error) {
      console.error('Error getting memory count:', error)
      return 0
    }
  }

  /**
   * Limpia memorias antiguas de baja importancia (estrategia de limpieza)
   */
  async cleanOldMemories(chatId: string, daysOld: number = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      await MemoryEntry.deleteMany({
        chatId,
        importance: 'low',
        createdAt: { $lt: cutoffDate },
      })
    } catch (error) {
      console.error('Error cleaning old memories:', error)
    }
  }

  /**
   * Obtiene estadísticas de memoria de un chat
   */
  async getMemoryStats(chatId: string) {
    try {
      const stats = await MemoryEntry.aggregate([
        { $match: { chatId } },
        {
          $group: {
            _id: '$importance',
            count: { $sum: 1 },
          },
        },
      ])

      const total = await MemoryEntry.countDocuments({ chatId })

      return {
        total,
        byImportance: Object.fromEntries(
          stats.map((s) => [s._id, s.count])
        ),
      }
    } catch (error) {
      console.error('Error getting memory stats:', error)
      return { total: 0, byImportance: {} }
    }
  }
}

export default new MemoryService()
