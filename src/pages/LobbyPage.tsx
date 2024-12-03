import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useGameStore } from '../store/gameStore';

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, currentPlayer, addRoom } = useGameStore();

  const createRoom = () => {
    if (!currentPlayer) return;
    
    const newRoom = {
      id: crypto.randomUUID(),
      name: `Cercle de ${currentPlayer.username}`,
      players: [{ ...currentPlayer, isHost: true }],
      status: 'waiting',
      maxPlayers: 6,
    } as const;
    
    addRoom(newRoom);
    navigate(`/game/${newRoom.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Salons Mystiques</h1>
          <Button onClick={createRoom}>
            <PlusCircle className="w-5 h-5 mr-2" />
            Créer un Cercle
          </Button>
        </div>

        <div className="grid gap-4">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{room.name}</h3>
                  <div className="flex items-center text-purple-300">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{room.players.length} / {room.maxPlayers}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/game/${room.id}`)}
                  disabled={room.players.length >= room.maxPlayers}
                >
                  Rejoindre
                </Button>
              </div>
            </Card>
          ))}

          {rooms.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-purple-300">Aucun cercle n'est actif pour le moment...</p>
              <p className="text-sm text-purple-400 mt-2">Créez le vôtre pour commencer le rituel !</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};