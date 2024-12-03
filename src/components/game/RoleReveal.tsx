import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../../types/game';
import { getRoleInfo } from '../../utils/roleUtils';
import { Sparkles, X } from 'lucide-react';

interface RoleRevealProps {
  player: Player;
  onClose: () => void;
}

export const RoleReveal: React.FC<RoleRevealProps> = ({ player, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const roleInfo = player.role ? getRoleInfo(player.role) : null;

  if (!roleInfo) return null;

  const alignmentColors = {
    white: 'from-blue-600 to-purple-900',
    dark: 'from-red-900 to-purple-900',
    hermit: 'from-green-800 to-purple-900',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.button
          className="absolute top-4 right-4 text-purple-300 hover:text-purple-100"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        <div className="perspective-1000">
          <motion.div
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onAnimationComplete={() => !isFlipped && setIsFlipped(true)}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-80 h-[28rem]"
          >
            {/* Face avant (dos de la carte) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-900 to-gray-900 rounded-2xl border-2 border-purple-500/30 p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />
                <h3 className="mt-4 text-xl font-medium text-purple-200">
                  Votre Rôle Mystique
                </h3>
              </div>
            </motion.div>

            {/* Face arrière (contenu de la carte) */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${alignmentColors[roleInfo.alignment]} rounded-2xl border-2 border-purple-500/30 p-8 backface-hidden`}
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="h-full flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold text-purple-200 mb-2">
                    {roleInfo.name}
                  </h3>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4" />
                  <p className="text-purple-300 mb-6">
                    {roleInfo.description}
                  </p>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <h4 className="text-sm font-medium text-purple-200 mb-2">
                      Objectif
                    </h4>
                    <p className="text-sm text-purple-300 mb-4">
                      {roleInfo.objective}
                    </p>
                    {roleInfo.abilities.length > 0 && (
                      <>
                        <h4 className="text-sm font-medium text-purple-200 mb-2">
                          Capacités Spéciales
                        </h4>
                        {roleInfo.abilities.map((ability, index) => (
                          <div key={index} className="text-sm text-purple-300">
                            <span className="font-medium">{ability.name}</span>: {ability.description}
                            {ability.usesPerGame && (
                              <span className="block text-xs text-purple-400 mt-1">
                                Utilisable {ability.usesPerGame} fois par partie
                              </span>
                            )}
                            {ability.usesPerRound && (
                              <span className="block text-xs text-purple-400 mt-1">
                                Utilisable {ability.usesPerRound} fois par tour
                              </span>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};