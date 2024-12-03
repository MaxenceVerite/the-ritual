import React from 'react';
import { motion } from 'framer-motion';
import { Room } from '../../types/game';
import { Scroll } from 'lucide-react';

interface RecipeProps {
  room: Room;
}

export const Recipe: React.FC<RecipeProps> = ({ room }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-r from-purple-900/30 to-gray-900/30 rounded-xl p-4 border border-purple-500/20"
    >
      <div className="flex items-center gap-3 mb-2">
        <Scroll className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-medium text-purple-200">
          Recette Mystique
        </h3>
      </div>

      <div className="text-sm text-purple-300">
        <p>
          Tour {room.currentRound} - Phase {room.currentPhase}
        </p>
      </div>
    </motion.div>
  );
};
