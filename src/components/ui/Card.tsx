import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/90 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};