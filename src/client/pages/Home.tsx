import { FC } from 'react'
import { Link } from 'react-router-dom'

const Home: FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">
          NEXUS
        </h1>
        <p className="text-xl text-primary-600 mb-12 font-semibold tracking-widest">PLATAFORMA DE IA AVANZADA</p>
        <p className="text-2xl text-gray-300 mb-12">
          Conversación y roleplay inmersivo con inteligencia artificial
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Link to="/characters" className="card hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold mb-2">Personajes</h3>
            <p className="text-gray-400">Crea y gestiona personajes sin límite</p>
          </Link>
          
          <Link to="/chats" className="card hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-2">Chats</h3>
            <p className="text-gray-400">Conversaciones y roleplay inmersivos</p>
          </Link>
          
          <Link to="/profiles" className="card hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="text-2xl font-bold mb-2">Perfiles</h3>
            <p className="text-gray-400">Crea múltiples identidades de usuario</p>
          </Link>
          
          <Link to="/settings" className="card hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold mb-2">Ajustes</h3>
            <p className="text-gray-400">Personaliza tu experiencia</p>
          </Link>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/characters/new" className="btn btn-primary px-8 py-3 text-lg">
            + Crear Personaje
          </Link>
          <Link to="/chats" className="btn btn-secondary px-8 py-3 text-lg">
            Ir a Chats
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
