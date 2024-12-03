import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Room, Player, GamePhase } from '../../types/game';
import { ingredients } from '../../data/ingredients';
import { roles } from '../../data/roles';

interface GamePhasesProps {
  room: Room;
  currentPlayer: Player;
  onSelectIngredient: (ingredient: (typeof ingredients)[0]) => void;
  onVote: (targetId: string) => void;
  onNextPhase: () => void;
}

export const GamePhases: React.FC<GamePhasesProps> = ({
  room,
  currentPlayer,
  onSelectIngredient,
  onVote,
  onNextPhase,
}) => {
  const phase = room.currentPhase;
  const playerRole = currentPlayer.role ? roles[currentPlayer.role] : null;

  const renderPhaseContent = () => {
    switch (phase) {
      case 'preparation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-300">
              Phase de Préparation - Tour {room.currentRound}
            </h3>
            <p className="text-gray-300">
              Choisissez un ingrédient à ajouter au chaudron
            </p>
            <div className="grid grid-cols-2 gap-4">
              {ingredients.map((ingredient) => (
                <Button
                  key={ingredient.id}
                  variant="secondary"
                  onClick={() => onSelectIngredient(ingredient)}
                  disabled={currentPlayer.selectedIngredient !== undefined}
                >
                  {ingredient.name}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'debate':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-300">
              Phase de Débat
            </h3>
            <p className="text-gray-300">
              Discutez des actions suspectes et formez vos alliances
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-purple-300">
                Chat en cours d'implémentation...
              </p>
            </div>
          </div>
        );

      case 'voting':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-300">
              Phase de Vote
            </h3>
            <p className="text-gray-300">
              Votez pour bannir une sorcière suspecte
            </p>
            <div className="grid gap-2">
              {room.players
                .filter((p) => p.id !== currentPlayer.id && p.isAlive)
                .map((player) => (
                  <Button
                    key={player.id}
                    variant="secondary"
                    onClick={() => onVote(player.id)}
                    disabled={currentPlayer.hasVoted}
                  >
                    Voter contre {player.username}
                  </Button>
                ))}
            </div>
          </div>
        );

      case 'revelation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-300">
              Phase de Révélation
            </h3>
            <p className="text-gray-300">Les secrets sont révélés...</p>
            <div className="bg-purple-900/30 rounded-lg p-4">
              <h4 className="font-medium text-purple-300 mb-2">
                État de la Potion
              </h4>
              <div className="space-y-2">
                {room.cauldronIngredients.map((ingredient, index) => (
                  <div key={index} className="text-gray-300">
                    Tour {index + 1}: {ingredient.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Phase Actuelle</h2>
            {playerRole && (
              <p className="text-sm text-purple-400">
                Votre rôle: {playerRole.name}
              </p>
            )}
          </div>
          {currentPlayer.isHost && (
            <Button onClick={onNextPhase}>Phase Suivante</Button>
          )}
        </div>
      </div>

      <motion.div
        key={phase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {renderPhaseContent()}
      </motion.div>
    </Card>
  );
};
