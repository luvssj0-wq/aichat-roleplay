import { FC, useState, useEffect } from 'react'
import api from '@api/index'
import { motion } from 'framer-motion'

interface Character {
  _id: string
  name: string
  image?: string
  personality: string
  profession: string
  type: 'real' | 'fictional' | 'mixed'
  tags: string[]
  isPublic: boolean
  createdAt: string
}

const CharactersList: FC = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'real' | 'fictional' | 'mixed'>('all')

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/api/characters/user/user-123') // TODO: Replace with actual user ID
      setCharacters(response.data.characters || [])
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (characterId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este personaje?')) return

    try {
      await api.delete(`/api/characters/${characterId}`, {
        data: { userId: 'user-123' }, // TODO: Replace with actual user ID
      })
      setCharacters(characters.filter((c) => c._id !== characterId))
    } catch (error) {
      console.error('Error deleting character:', error)
    }
  }

  const handleExport = async (character: Character) => {
    try {
      const response = await api.get(`/api/characters/${character._id}/export`)
      const dataStr = JSON.stringify(response.data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${character.name}.json`
      link.click()
    } catch (error) {
      console.error('Error exporting character:', error)
    }
  }

  const filteredCharacters = characters.filter((char) => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || char.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="w-full h-full px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Personajes</h1>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Buscar personajes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-64 bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-600"
            >
              <option value="all">Todos</option>
              <option value="real">Reales</option>
              <option value="fictional">Ficticios</option>
              <option value="mixed">Mixtos</option>
            </select>
          </div>
        </div>

        {/* Characters Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Cargando personajes...</p>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No hay personajes</p>
            <a href="/characters/new" className="btn btn-primary">
              Crear Primer Personaje
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <motion.div
                key={character._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card group overflow-hidden"
              >
                {/* Character Image */}
                {character.image && (
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{character.name}</h3>
                    <p className="text-sm text-primary-600 font-semibold">{character.profession}</p>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {character.personality || 'Sin descripción'}
                  </p>

                  {/* Type Badge */}
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      character.type === 'real'
                        ? 'bg-blue-900/30 text-blue-400'
                        : character.type === 'fictional'
                        ? 'bg-purple-900/30 text-purple-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {character.type === 'real' ? 'Real' : character.type === 'fictional' ? 'Ficticio' : 'Mixto'}
                    </span>
                    {character.isPublic && (
                      <span className="text-xs px-2 py-1 rounded-full font-semibold bg-primary-900/30 text-primary-400">
                        Público
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {character.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {character.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-dark-800 text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                      {character.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{character.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-dark-800">
                    <button className="flex-1 btn btn-secondary text-sm py-2">
                      Editar
                    </button>
                    <button
                      onClick={() => handleExport(character)}
                      className="flex-1 btn btn-ghost text-sm py-2"
                    >
                      Exportar
                    </button>
                    <button
                      onClick={() => handleDelete(character._id)}
                      className="btn btn-ghost text-sm py-2 text-red-400 hover:bg-red-900/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CharactersList
