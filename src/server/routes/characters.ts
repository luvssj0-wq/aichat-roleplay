import { Router, Request, Response } from 'express'
import Character from '../models/Character'
import { Character as CharacterType } from '@types/index'

const router = Router()

/**
 * POST /api/characters
 * Crear un nuevo personaje
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, ...characterData } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    if (!characterData.name) {
      return res.status(400).json({ error: 'Character name is required' })
    }

    const character = new Character({
      userId,
      ...characterData,
    })

    const savedCharacter = await character.save()

    res.status(201).json({
      success: true,
      character: savedCharacter,
    })
  } catch (error) {
    console.error('Error creating character:', error)
    res.status(500).json({ error: 'Failed to create character' })
  }
})

/**
 * GET /api/characters/:userId
 * Obtener todos los personajes del usuario
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { sort = '-createdAt', limit = '50', skip = '0' } = req.query

    const characters = await Character.find({ userId })
      .sort(sort as string)
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string))

    const total = await Character.countDocuments({ userId })

    res.json({
      success: true,
      characters,
      pagination: {
        total,
        limit: parseInt(limit as string),
        skip: parseInt(skip as string),
      },
    })
  } catch (error) {
    console.error('Error fetching characters:', error)
    res.status(500).json({ error: 'Failed to fetch characters' })
  }
})

/**
 * GET /api/characters/:characterId
 * Obtener un personaje específico
 */
router.get('/:characterId', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params

    const character = await Character.findById(characterId)

    if (!character) {
      return res.status(404).json({ error: 'Character not found' })
    }

    res.json({
      success: true,
      character,
    })
  } catch (error) {
    console.error('Error fetching character:', error)
    res.status(500).json({ error: 'Failed to fetch character' })
  }
})

/**
 * PUT /api/characters/:characterId
 * Actualizar un personaje
 */
router.put('/:characterId', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params
    const { userId, ...updateData } = req.body

    const character = await Character.findById(characterId)

    if (!character) {
      return res.status(404).json({ error: 'Character not found' })
    }

    // Verificar que sea el propietario
    if (character.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    Object.assign(character, updateData)
    const updatedCharacter = await character.save()

    res.json({
      success: true,
      character: updatedCharacter,
    })
  } catch (error) {
    console.error('Error updating character:', error)
    res.status(500).json({ error: 'Failed to update character' })
  }
})

/**
 * DELETE /api/characters/:characterId
 * Eliminar un personaje (soft delete)
 */
router.delete('/:characterId', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params
    const { userId } = req.body

    const character = await Character.findById(characterId)

    if (!character) {
      return res.status(404).json({ error: 'Character not found' })
    }

    // Verificar que sea el propietario
    if (character.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await Character.findByIdAndDelete(characterId)

    res.json({
      success: true,
      message: 'Character deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting character:', error)
    res.status(500).json({ error: 'Failed to delete character' })
  }
})

/**
 * POST /api/characters/:characterId/duplicate
 * Duplicar un personaje
 */
router.post('/:characterId/duplicate', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params
    const { userId } = req.body

    const originalCharacter = await Character.findById(characterId)

    if (!originalCharacter) {
      return res.status(404).json({ error: 'Character not found' })
    }

    // Verificar que sea el propietario
    if (originalCharacter.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const duplicatedCharacter = new Character({
      ...originalCharacter.toObject(),
      _id: undefined,
      name: `${originalCharacter.name} (Copia)`,
    })

    const savedCharacter = await duplicatedCharacter.save()

    res.status(201).json({
      success: true,
      character: savedCharacter,
    })
  } catch (error) {
    console.error('Error duplicating character:', error)
    res.status(500).json({ error: 'Failed to duplicate character' })
  }
})

/**
 * POST /api/characters/:characterId/export
 * Exportar personaje como JSON
 */
router.get('/:characterId/export', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params

    const character = await Character.findById(characterId)

    if (!character) {
      return res.status(404).json({ error: 'Character not found' })
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${character.name}.json"`
    )
    res.json(character)
  } catch (error) {
    console.error('Error exporting character:', error)
    res.status(500).json({ error: 'Failed to export character' })
  }
})

/**
 * POST /api/characters/import
 * Importar personaje desde JSON
 */
router.post('/import', async (req: Request, res: Response) => {
  try {
    const { userId, characterData } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    if (!characterData) {
      return res.status(400).json({ error: 'characterData is required' })
    }

    const character = new Character({
      ...characterData,
      userId,
      _id: undefined,
    })

    const savedCharacter = await character.save()

    res.status(201).json({
      success: true,
      character: savedCharacter,
    })
  } catch (error) {
    console.error('Error importing character:', error)
    res.status(500).json({ error: 'Failed to import character' })
  }
})

/**
 * GET /api/characters/search/:userId
 * Buscar personajes por nombre, personalidad o tags
 */
router.get('/search/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' })
    }

    const characters = await Character.find(
      {
        userId,
        $text: { $search: q as string },
      },
      {
        score: { $meta: 'textScore' },
      }
    ).sort({ score: { $meta: 'textScore' } })

    res.json({
      success: true,
      characters,
      count: characters.length,
    })
  } catch (error) {
    console.error('Error searching characters:', error)
    res.status(500).json({ error: 'Failed to search characters' })
  }
})

export default router
