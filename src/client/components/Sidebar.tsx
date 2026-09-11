import { FC, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Inicio', path: '/', icon: '🏠' },
    { label: 'Personajes', path: '/characters', icon: '🎭' },
    { label: 'Chats', path: '/chats', icon: '💬' },
    { label: 'Perfiles', path: '/profiles', icon: '👤' },
    { label: 'Favoritos', path: '/favorites', icon: '⭐' },
    { label: 'Ajustes', path: '/settings', icon: '⚙️' },
    { label: 'Papelera', path: '/trash', icon: '🗑️' },
  ]

  return (
    <motion.aside
      className={`bg-dark-900 border-r border-dark-800 h-full flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      initial={false}
    >
      {/* Logo */}
      <div className="p-4 border-b border-dark-800 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">NEXUS</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-primary-600 transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-dark-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="p-4 border-t border-dark-800 space-y-2">
        <Link
          to="/characters/new"
          className="btn btn-primary w-full text-center justify-center"
        >
          {!isCollapsed ? '+ Personaje' : '+'}
        </Link>
        {!isCollapsed && (
          <button className="btn btn-secondary w-full">
            🔍 Buscar
          </button>
        )}
      </div>
    </motion.aside>
  )
}

export default Sidebar
