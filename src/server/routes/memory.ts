import { Router, Request, Response } from 'express'
const router = Router()

// Importar servicios
import MemoryService from '../services/MemoryService'
import ContextService from '../services/ContextService'
import InfiniteMemoryOrchestrator from '../services/InfiniteMemoryOrchestrator'

/**
 * POST /api/memory/store
 * Almacena un nuevo recuerdo
 */
router.post('/store', async (req: Request, res: Response) => {
  try {
    const { chatId, content, importance, characterId, tags, source } = req.body

    if (!chatId || !content) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const memory = await MemoryService.storeMemory(
      chatId,
      content,
      importance || 'medium',
      characterId,
      tags || [],
      source || 'ai'
    )

    res.json({
      success: true,
      memory,
    })
  } catch (error) {
    console.error('Error storing memory:', error)
    res.status(500).json({ error: 'Failed to store memory' })
  }
})

/**
 * POST /api/memory/retrieve
 * Recupera memorias relevantes basado en query
 */
router.post('/retrieve', async (req: Request, res: Response) => {
  try {
    const { chatId, query, limit, characterId } = req.body

    if (!chatId || !query) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const memories = await MemoryService.retrieveRelevantMemories(
      chatId,
      query,
      limit || 10,
      characterId
    )

    res.json({
      success: true,
      memories,
      count: memories.length,
    })
  } catch (error) {
    console.error('Error retrieving memories:', error)
    res.status(500).json({ error: 'Failed to retrieve memories' })
  }
})

/**
 * GET /api/memory/stats/:chatId
 * Obtiene estadísticas de memoria
 */
router.get('/stats/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    const stats = await MemoryService.getMemoryStats(chatId)

    res.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({ error: 'Failed to get statistics' })
  }
})

/**
 * POST /api/context/store-messages
 * Almacena mensajes del chat
 */
router.post('/store-messages', async (req: Request, res: Response) => {
  try {
    const { chatId, messages } = req.body

    if (!chatId || !messages) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    await ContextService.storeMessages(chatId, messages)

    res.json({
      success: true,
      message: 'Messages stored successfully',
    })
  } catch (error) {
    console.error('Error storing messages:', error)
    res.status(500).json({ error: 'Failed to store messages' })
  }
})

/**
 * POST /api/context/optimal
 * Obtiene el contexto óptimo para la IA
 */
router.post('/optimal', async (req: Request, res: Response) => {
  try {
    const { chatId, query, maxMessages, includeMemories } = req.body

    if (!chatId || !query) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const context = await ContextService.getOptimalContext(
      chatId,
      query,
      maxMessages || 20,
      includeMemories !== false
    )

    res.json({
      success: true,
      context,
    })
  } catch (error) {
    console.error('Error getting optimal context:', error)
    res.status(500).json({ error: 'Failed to get context' })
  }
})

/**
 * POST /api/orchestrator/prepare-context
 * Prepara contexto completo para IA
 */
router.post('/orchestrator/prepare', async (req: Request, res: Response) => {
  try {
    const { chatId, userQuery, maxMessages, characterId } = req.body

    if (!chatId || !userQuery) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const preparedContext = await InfiniteMemoryOrchestrator.prepareContextForAI(
      chatId,
      userQuery,
      maxMessages || 20,
      characterId
    )

    res.json({
      success: true,
      context: preparedContext,
    })
  } catch (error) {
    console.error('Error preparing context:', error)
    res.status(500).json({ error: 'Failed to prepare context' })
  }
})

export default router
