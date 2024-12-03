import React from 'react';
import { motion } from 'framer-motion';
import { Cauldron } from './Cauldron';
import { Recipe } from './Recipe';
import { Room } from '../../types/game';

interface GameBoardProps {
  room: Room;
}

export const GameBoard: React.FC<GameBoardProps> = ({ room }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full aspect-[16/9] bg-gradient-to-b from-purple-900/30 to-gray-900/30 rounded-2xl backdrop-blur-sm border border-purple-500/20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514994960127-ed3f9a94e29a?q=80&w=2070')] bg-cover bg-center opacity-20" />
      
      <div className="relative h-full grid grid-rows-[auto,1fr] gap-4 p-6">
        <Recipe room={room} />
        <Cauldron room={room} />
      </div>
    </motion.div>
  );
};