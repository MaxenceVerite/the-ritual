import React from 'react';
import { motion } from 'framer-motion';
import { Room } from '../../types/game';

interface CauldronProps {
  room: Room;
}

export const Cauldron: React.FC<CauldronProps> = ({ room }) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.5 }}
        className="relative w-64 h-64"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-purple-900/40 rounded-full border-2 border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.3)] animate-glow">
          <div className="absolute inset-4 bg-gradient-to-b from-purple-400/20 to-purple-800/40 rounded-full border border-purple-400/30" />
        </div>
        
        {room.cauldronIngredients.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute inset-8 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-purple-300 text-sm mb-2">Ingrédients ({room.cauldronIngredients.length})</p>
              <div className="space-y-1">
                {room.cauldronIngredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xs text-purple-200"
                  >
                    {ingredient.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};