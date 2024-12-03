import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="relative">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/game/:roomId" element={<GamePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;