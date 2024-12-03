import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Bot } from 'lucide-react';
import { generateAiPlayers } from '../../utils/aiLogic';
import { useGameStore } from '../../store/gameStore';
import { Room } from '../../types/game';

interface AiControlsProps {
  room: Room;
}

export const AiControls: React.FC<AiControlsProps> = ({ room }) => {
  const { updateRoom } = useGameStore();

  const addAiPlayers = () => {
    const currentPlayerCount = room.players.length;
    const aiCount = 4 - currentPlayerCount;
    
    if (aiCount <= 0) return;

    const aiPlayers = generateAiPlayers(aiCount);
    
    updateRoom(room.id, {
      ...room,
      players: [...room.players, ...aiPlayers],
      aiEnabled: true,
    });
  };

  if (room.status !== 'waiting' || room.players.length >= 4) {
    return null;
  }

  return (
    <Card className="text-center py-6">
      <h3 className="text-lg font-medium text-purple-300 mb-4">
        Mode Test avec IA
      </h3>
      <Button
        onClick={addAiPlayers}
        className="inline-flex items-center"
      >
        <Bot className="w-5 h-5 mr-2" />
        Ajouter des Sorcières IA
      </Button>
      <p className="text-sm text-purple-400 mt-4">
        Ajoutera {4 - room.players.length} sorcières IA pour compléter la partie
      </p>
    </Card>
  );
};