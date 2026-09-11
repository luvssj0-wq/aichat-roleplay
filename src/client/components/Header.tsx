import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const Header: FC = () => {
  const location = useLocation()

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      '/': 'Inicio',
      '/characters': 'Personajes',
      '/chats': 'Chats',
      '/profiles': 'Perfiles',
      '/settings': 'Ajustes',
    }
    return titles[location.pathname] || 'NEXUS'
  }

  return (
    <header className="bg-dark-900 border-b border-dark-800 px-8 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{getPageTitle()}</h2>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
        />
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
          👤
        </div>
      </div>
    </header>
  )
}

export default Header
