import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameStore } from '../../store/gameStore';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentPlayer({
        id: crypto.randomUUID(),
        username: username.trim(),
      });
      navigate('/lobby');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Le Cercle des Sorcières</h1>
        <p className="text-purple-300">Rejoignez le rituel mystique</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-2">
            Nom de Sorcière
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            placeholder="Entrez votre nom mystique..."
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Entrer dans le Cercle
        </Button>
      </form>
    </Card>
  );
};