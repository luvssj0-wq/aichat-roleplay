import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@api/index'

interface CharacterFormData {
  name: string
  image?: string
  personality: string
  appearance: string
  history: string
  profession: string
  relationships: string
  scenario: string
  context: string
  lore: string
  additionalInfo: string
  initialMessage: string
  systemPrompt: string
  temperature: number
  tags: string
  isPublic: boolean
  type: 'real' | 'fictional' | 'mixed'
  modelConfig: {
    model: string
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
}

const CharacterForm: FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'config'>('basic')

  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    image: '',
    personality: '',
    appearance: '',
    history: '',
    profession: '',
    relationships: '',
    scenario: '',
    context: '',
    lore: '',
    additionalInfo: '',
    initialMessage: '',
    systemPrompt: '',
    temperature: 0.7,
    tags: '',
    isPublic: false,
    type: 'fictional',
    modelConfig: {
      model: 'gpt-3.5-turbo',
      maxTokens: 2048,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    },
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleModelConfigChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      modelConfig: {
        ...prev.modelConfig,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!formData.name.trim()) {
        throw new Error('El nombre del personaje es requerido')
      }

      const characterData = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
      }

      const response = await api.post('/api/characters', {
        userId: 'user-123', // TODO: Replace with actual user ID
        ...characterData,
      })

      if (response.data.success) {
        navigate('/characters')
      }
    } catch (err: any) {
      setError(err.message || 'Error creating character')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Información Básica' },
    { id: 'personality', label: 'Personalidad & Lore' },
    { id: 'config', label: 'Configuración' },
  ]

  return (
    <div className="w-full h-full px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-2">Crear Nuevo Personaje</h1>
          <p className="text-gray-400 mb-8">Define cada aspecto del personaje para la mejor experiencia</p>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-dark-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Nombre del Personaje *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                      placeholder="Ej: Elena Shadowborne"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Tipo de Personaje
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
                    >
                      <option value="fictional">Ficticio</option>
                      <option value="real">Real</option>
                      <option value="mixed">Mixto</option>
                    </select>
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Profesión
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                    placeholder="Ej: Cazadora de Magia Oscura, Detective, Hechicera"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-4">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full max-w-xs h-auto rounded-lg object-cover border border-dark-700"
                      />
                    </div>
                  )}
                </div>

                {/* Appearance */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Apariencia
                  </label>
                  <textarea
                    value={formData.appearance}
                    onChange={(e) => handleInputChange('appearance', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-32"
                    placeholder="Describe la apariencia física del personaje: altura, peso, color de cabello, ojos, marcas particulares, etc."
                  />
                </div>
              </motion.div>
            )}

            {/* Personality & Lore Tab */}
            {activeTab === 'personality' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Personality */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Personalidad
                  </label>
                  <textarea
                    value={formData.personality}
                    onChange={(e) => handleInputChange('personality', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-40"
                    placeholder="Describe los rasgos de personalidad: comportamiento, reacciones emocionales, fortalezas, debilidades, etc."
                  />
                </div>

                {/* History */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Historia
                  </label>
                  <textarea
                    value={formData.history}
                    onChange={(e) => handleInputChange('history', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-40"
                    placeholder="El trasfondo y vida pasada del personaje. Momentos clave, traumas, logros."
                  />
                </div>

                {/* Lore */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Lore Extenso
                  </label>
                  <textarea
                    value={formData.lore}
                    onChange={(e) => handleInputChange('lore', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-40"
                    placeholder="Información detallada, mundo en el que existe, contexto general, leyendas relacionadas."
                  />
                </div>

                {/* Relationships */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Relaciones
                  </label>
                  <textarea
                    value={formData.relationships}
                    onChange={(e) => handleInputChange('relationships', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-32"
                    placeholder="Relaciones con otros personajes: familia, amigos, enemigos, aliados."
                  />
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Información Adicional
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-32"
                    placeholder="Cualquier otro detalle importante: habilidades especiales, secretos, objetivos, miedos."
                  />
                </div>
              </motion.div>
            )}

            {/* Configuration Tab */}
            {activeTab === 'config' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Guía Interna para la IA
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Esta guía solo la ve la IA, no aparecerá como diálogo normal
                  </p>
                  <textarea
                    value={formData.systemPrompt}
                    onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-40"
                    placeholder="Ej: Siempre responde en tercera persona. Incluye acciones entre asteriscos. Mantén el tono oscuro y misterioso."
                  />
                </div>

                {/* Initial Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Mensaje Inicial
                  </label>
                  <textarea
                    value={formData.initialMessage}
                    onChange={(e) => handleInputChange('initialMessage', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-24"
                    placeholder="El primer mensaje que el personaje enviará cuando se inicie un chat"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Temperatura (Creatividad)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.temperature.toFixed(1)} - {formData.temperature < 0.3 ? 'Preciso' : formData.temperature < 0.7 ? 'Balanceado' : 'Creativo'}
                  </p>
                </div>

                {/* Model Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Modelo
                    </label>
                    <select
                      value={formData.modelConfig.model}
                      onChange={(e) => handleModelConfigChange('model', e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
                    >
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Tokens Máximos
                    </label>
                    <input
                      type="number"
                      min="256"
                      max="4096"
                      value={formData.modelConfig.maxTokens}
                      onChange={(e) => handleModelConfigChange('maxTokens', parseInt(e.target.value))}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Top P
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.modelConfig.topP}
                      onChange={(e) => handleModelConfigChange('topP', parseFloat(e.target.value))}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Frequency Penalty
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.modelConfig.frequencyPenalty}
                      onChange={(e) => handleModelConfigChange('frequencyPenalty', parseFloat(e.target.value))}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Presence Penalty
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.modelConfig.presencePenalty}
                      onChange={(e) => handleModelConfigChange('presencePenalty', parseFloat(e.target.value))}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Scenario & Context */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Escenario
                  </label>
                  <textarea
                    value={formData.scenario}
                    onChange={(e) => handleInputChange('scenario', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-24"
                    placeholder="El contexto o escenario donde la IA debería imaginar que está con este personaje."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Contexto General
                  </label>
                  <textarea
                    value={formData.context}
                    onChange={(e) => handleInputChange('context', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors resize-none h-24"
                    placeholder="Información global sobre el universo, mundo o contexto del personaje."
                  />
                </div>

                {/* Tags & Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Etiquetas (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                      placeholder="Ej: fantasy, oscuro, misterioso, romance"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm font-semibold text-white">
                        Hacer público
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-8 border-t border-dark-800">
              <button
                type="button"
                onClick={() => navigate('/characters')}
                className="btn btn-secondary px-8 py-3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando...' : 'Crear Personaje'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CharacterForm
