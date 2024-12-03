import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../types/game';
import { RoleReveal } from './RoleReveal';
import { Sparkles } from 'lucide-react';
import { getRoleInfo } from '../../utils/roleUtils';

interface RoleButtonProps {
  player: Player;
}

export const RoleButton: React.FC<RoleButtonProps> = ({ player }) => {
  const [showRoleCard, setShowRoleCard] = useState(false);
  const roleInfo = player.role ? getRoleInfo(player.role) : null;

  if (!roleInfo) return null;

  const alignmentColors = {
    white: 'from-blue-600/80 to-purple-900/80',
    dark: 'from-red-900/80 to-purple-900/80',
    hermit: 'from-green-800/80 to-purple-900/80',
  };

  return (
    <>
      <motion.button
        onClick={() => setShowRoleCard(true)}
        className={`fixed top-4 right-4 bg-gradient-to-br ${alignmentColors[roleInfo.alignment]} backdrop-blur-sm rounded-lg p-3 border border-purple-500/30 shadow-lg z-40 group`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-300 group-hover:text-purple-200" />
          <div className="text-left">
            <div className="text-sm font-medium text-purple-200 group-hover:text-white">
              {roleInfo.name}
            </div>
            <div className="text-xs text-purple-400 group-hover:text-purple-300">
              Voir mon rôle
            </div>
          </div>
        </div>
      </motion.button>

      {showRoleCard && (
        <RoleReveal player={player} onClose={() => setShowRoleCard(false)} />
      )}
    </>
  );
};