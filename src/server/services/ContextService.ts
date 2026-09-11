import ChatMessage from '../models/ChatMessage'
import ContextCompression from '../models/ContextCompression'
import ConversationSnapshot from '../models/ConversationSnapshot'
import { Message } from '@types/index'

export class ContextService {
  /**
   * Almacena el historial de mensajes de forma escalable
   */
  async storeMessages(chatId: string, messages: Message[]) {
    try {
      const existing = await ChatMessage.findOne({ chatId })

      if (existing) {
        existing.messages = messages
        existing.totalMessages = messages.length
        existing.lastMessageAt = new Date()
        await existing.save()
      } else {
        await ChatMessage.create({
          chatId,
          messages,
          totalMessages: messages.length,
          lastMessageAt: new Date(),
        })
      }
    } catch (error) {
      console.error('Error storing messages:', error)
      throw error
    }
  }

  /**
   * Recupera mensajes de un chat
   */
  async getMessages(
    chatId: string,
    limit?: number,
    offset: number = 0
  ): Promise<Message[]> {
    try {
      const chat = await ChatMessage.findOne({ chatId })

      if (!chat) return []

      const messages = chat.messages
      const start = Math.max(0, messages.length - (limit || messages.length) - offset)
      const end = messages.length - offset

      return messages.slice(start, end)
    } catch (error) {
      console.error('Error retrieving messages:', error)
      return []
    }
  }

  /**
   * Obtiene el contexto óptimo para la IA
   * Combina:
   * - Últimos mensajes (contexto inmediato)
   * - Memorias relevantes (recuperadas inteligentemente)
   * - Resumen de contexto antiguo (si es necesario)
   */
  async getOptimalContext(
    chatId: string,
    query: string,
    maxMessages: number = 20,
    includeMemories: boolean = true
  ): Promise<{
    recentMessages: Message[]
    relevantMemories: any[]
    contextSummary?: string
    estimatedTokens: number
  }> {
    try {
      // Obtener últimos mensajes
      const messages = await this.getMessages(chatId, maxMessages)

      // Importar MemoryService
      const MemoryService = (await import('./MemoryService')).default

      // Obtener memorias relevantes si está habilitado
      let relevantMemories: any[] = []
      if (includeMemories) {
        relevantMemories = await MemoryService.retrieveRelevantMemories(
          chatId,
          query,
          5
        )
      }

      // Buscar resumen si el chat es muy largo
      let contextSummary: string | undefined
      const messageCount = await MemoryService.getMemoryCount(chatId)
      if (messageCount > 1000) {
        const snapshot = await ConversationSnapshot.findOne({ chatId })
          .sort({ createdAt: -1 })
        if (snapshot) {
          contextSummary = snapshot.snapshot.content
        }
      }

      // Estimar tokens (aproximación simple)
      const estimatedTokens =
        messages.length * 100 +
        relevantMemories.length * 50 +
        (contextSummary?.length || 0) / 4

      return {
        recentMessages: messages,
        relevantMemories,
        contextSummary,
        estimatedTokens,
      }
    } catch (error) {
      console.error('Error getting optimal context:', error)
      return {
        recentMessages: [],
        relevantMemories: [],
        estimatedTokens: 0,
      }
    }
  }

  /**
   * Comprime el contexto cuando es necesario
   * Genera un resumen inteligente del historial
   */
  async compressContext(
    chatId: string,
    messages: Message[],
    characterNames: string[] = []
  ) {
    try {
      if (messages.length < 100) return null

      // Crear resumen (en producción, usar IA)
      const summary = this.generateSummary(messages, characterNames)
      const keyPoints = this.extractKeyPoints(messages)

      const compression = new ContextCompression({
        chatId,
        originalLength: messages.length,
        compressedLength: summary.length,
        summary,
        keyPoints,
      })

      return await compression.save()
    } catch (error) {
      console.error('Error compressing context:', error)
      return null
    }
  }

  /**
   * Genera un resumen simple del contexto
   */
  private generateSummary(
    messages: Message[],
    characterNames: string[] = []
  ): string {
    const importantMessages = messages.filter((m) => {
      const content = m.content.toLowerCase()
      return (
        content.length > 50 ||
        content.includes('muerte') ||
        content.includes('secreto') ||
        content.includes('verdad')
      )
    })

    const summary = importantMessages
      .slice(-20)
      .map((m) => `${m.role}: ${m.content.substring(0, 100)}...`)
      .join(' | ')

    return summary || 'Conversación sin puntos relevantes'
  }

  /**
   * Extrae puntos clave de la conversación
   */
  private extractKeyPoints(messages: Message[]): string[] {
    const keyPoints: string[] = []
    const keywords = [
      'muerte',
      'secreto',
      'verdad',
      'traición',
      'promesa',
      'decision',
      'descubrimiento',
    ]

    messages.forEach((msg) => {
      const content = msg.content.toLowerCase()
      keywords.forEach((kw) => {
        if (content.includes(kw) && !keyPoints.includes(msg.content)) {
          keyPoints.push(msg.content.substring(0, 150))
        }
      })
    })

    return keyPoints.slice(0, 10)
  }

  /**
   * Crea un snapshot de la conversación
   */
  async createSnapshot(
    chatId: string,
    messages: Message[]
  ): Promise<any> {
    try {
      const snapshot = new ConversationSnapshot({
        chatId,
        messageCount: messages.length,
        snapshot: {
          content: this.generateSummary(messages),
          type: 'summary',
        },
        extractedData: {
          locations: [],
          characters: [],
          events: this.extractKeyPoints(messages),
          decisions: [],
        },
      })

      return await snapshot.save()
    } catch (error) {
      console.error('Error creating snapshot:', error)
      return null
    }
  }
}

export default new ContextService()
