import React from 'react';
import { motion } from 'framer-motion';
import { Player, Room } from '../../types/game';
import { getRoleInfo } from '../../utils/roleUtils';
import { Crown, Ghost } from 'lucide-react';

interface PlayersListProps {
  room: Room;
  currentPlayer: Player;
}

export const PlayersList: React.FC<PlayersListProps> = ({
  room,
  currentPlayer,
}) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-b from-gray-900/90 to-purple-900/90 rounded-2xl border border-purple-500/20 p-6 space-y-4"
    >
      {room.players.map((player, index) => {
        const roleInfo = player.role ? getRoleInfo(player.role) : null;

        return (
          <motion.div
            key={player.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`relative p-4 rounded-xl ${
              player.id === currentPlayer.id
                ? 'bg-purple-900/50 border border-purple-500/50'
                : 'bg-gray-800/50'
            } ${!player.isAlive ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
              <span className="font-medium text-white">{player.username}</span>
              {player.type === 'ai' && (
                <span className="text-xs text-purple-400">[IA]</span>
              )}
            </div>

            {!player.isAlive && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <Ghost className="w-4 h-4" />
                <span>Éliminée</span>
              </div>
            )}

            {player.id === currentPlayer.id && roleInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-2 text-sm text-purple-300"
              >
                Rôle: {roleInfo.name}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
