import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@components/Layout'
import Home from '@pages/Home'
import CharactersList from '@components/CharactersList'
import CharacterForm from '@components/CharacterForm'
import Chats from '@pages/Chats'
import Profiles from '@pages/Profiles'
import Settings from '@pages/Settings'
import Chat from '@pages/Chat'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<CharactersList />} />
          <Route path="/characters/new" element={<CharacterForm />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profiles/new" element={<Profiles />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
