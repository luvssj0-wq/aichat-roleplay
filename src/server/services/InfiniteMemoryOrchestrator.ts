export class InfiniteMemoryOrchestrator {
  /**
   * Orquesta todo el sistema de memoria infinita
   * Coordina:
   * - Almacenamiento de memoria
   * - Recuperación inteligente
   * - Compresión de contexto
   * - Gestión de snapshots
   */

  async handleNewMessage(
    chatId: string,
    message: string,
    characterId?: string,
    role: 'user' | 'assistant' = 'assistant'
  ) {
    // Importar servicios
    const MemoryService = (await import('./MemoryService')).default
    const ContextService = (await import('./ContextService')).default

    try {
      // 1. Extraer datos importantes
      const { importance, tags } = await MemoryService.extractImportantData(
        message
      )

      // 2. Almacenar en memoria
      await MemoryService.storeMemory(
        chatId,
        message,
        importance,
        characterId,
        tags,
        role === 'user' ? 'user' : 'ai'
      )

      // 3. Verificar si necesita compresión (cada 500 mensajes)
      const memoryCount = await MemoryService.getMemoryCount(chatId)
      if (memoryCount % 500 === 0 && memoryCount > 0) {
        // Crear snapshot
        const ChatMessage = (await import('../models/ChatMessage')).default
        const chat = await ChatMessage.findOne({ chatId })
        if (chat) {
          await ContextService.createSnapshot(chatId, chat.messages)
        }
      }

      // 4. Limpiar memorias antiguas (cada 1000 mensajes)
      if (memoryCount % 1000 === 0) {
        await MemoryService.cleanOldMemories(chatId)
      }
    } catch (error) {
      console.error('Error in handleNewMessage:', error)
    }
  }

  async prepareContextForAI(
    chatId: string,
    userQuery: string,
    maxMessages: number = 20,
    characterId?: string
  ) {
    const MemoryService = (await import('./MemoryService')).default
    const ContextService = (await import('./ContextService')).default

    try {
      // 1. Obtener contexto óptimo
      const context = await ContextService.getOptimalContext(
        chatId,
        userQuery,
        maxMessages
      )

      // 2. Si hay memorias relevantes, añadirlas al prompt
      const relevantMemoriesText = context.relevantMemories
        .map(
          (m, i) =>
            `[Memoria ${i + 1}] ${m.content} (Importancia: ${m.importance})`
        )
        .join('\n')

      // 3. Construir prompt del sistema
      let systemPrompt = ''
      if (context.contextSummary) {
        systemPrompt += `\nContexto previo: ${context.contextSummary}\n`
      }
      if (relevantMemoriesText) {
        systemPrompt += `\nMemorias relevantes:\n${relevantMemoriesText}\n`
      }

      return {
        messages: context.recentMessages,
        systemContext: systemPrompt,
        estimatedTokens: context.estimatedTokens,
        memoriesUsed: context.relevantMemories.length,
      }
    } catch (error) {
      console.error('Error preparing context for AI:', error)
      return {
        messages: [],
        systemContext: '',
        estimatedTokens: 0,
        memoriesUsed: 0,
      }
    }
  }

  async getMemoryStatistics(chatId: string) {
    const MemoryService = (await import('./MemoryService')).default

    try {
      const stats = await MemoryService.getMemoryStats(chatId)
      return stats
    } catch (error) {
      console.error('Error getting memory statistics:', error)
      return { total: 0, byImportance: {} }
    }
  }
}

export default new InfiniteMemoryOrchestrator()
