import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { GameBoard } from '../components/game/GameBoard';
import { PlayersList } from '../components/game/PlayersList';
import { GamePhases } from '../components/game/GamePhases';
import { AiControls } from '../components/game/AiControls';
import { RoleReveal } from '../components/game/RoleReveal';
import { RoleButton } from '../components/game/RoleButton';
import { useGameStore } from '../store/gameStore';
import { useGameTurn } from '../hooks/useGameTurn';
import { Ingredient } from '../types/game';

export const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { rooms, currentPlayer, updateRoom } = useGameStore();
  const room = rooms.find((r) => r.id === roomId);
  const [showInitialRoleReveal, setShowInitialRoleReveal] = useState(false);
  
  const {
    selectedIngredient,
    setSelectedIngredient,
    startGame,
    nextPhase,
  } = useGameTurn(roomId || '');

  const handleSelectIngredient = (ingredient: Ingredient) => {
    if (!room || !currentPlayer || room.currentPhase !== 'preparation') return;

    const updatedPlayers = room.players.map((player) =>
      player.id === currentPlayer.id
        ? { ...player, selectedIngredient: ingredient }
        : player
    );

    const allPlayersSelected = updatedPlayers.every((p) => 
      !p.isAlive || p.selectedIngredient
    );

    if (allPlayersSelected) {
      const updatedRoom = {
        ...room,
        players: updatedPlayers,
        cauldronIngredients: [
          ...room.cauldronIngredients,
          ...updatedPlayers
            .filter(p => p.isAlive)
            .map(p => p.selectedIngredient!),
        ],
      };
      updateRoom(room.id, updatedRoom);
      nextPhase();
    } else {
      updateRoom(room.id, { ...room, players: updatedPlayers });
    }
  };

  const handleVote = (targetId: string) => {
    if (!room || !currentPlayer || room.currentPhase !== 'voting') return;

    const updatedPlayers = room.players.map((player) =>
      player.id === currentPlayer.id ? { ...player, hasVoted: true } : player
    );

    const votingResults = {
      ...room.votingResults,
      [currentPlayer.id]: targetId,
    };

    const allPlayersVoted = updatedPlayers.every((p) => 
      !p.isAlive || p.hasVoted
    );

    if (allPlayersVoted) {
      const voteCount = Object.values(votingResults).reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const eliminatedId = Object.entries(voteCount).reduce((a, b) =>
        (a[1] > b[1] ? a : b)
      )[0];

      const playersAfterVote = updatedPlayers.map((player) =>
        player.id === eliminatedId ? { ...player, isAlive: false } : player
      );

      updateRoom(room.id, {
        ...room,
        players: playersAfterVote,
        votingResults: {},
      });
      nextPhase();
    } else {
      updateRoom(room.id, {
        ...room,
        players: updatedPlayers,
        votingResults,
      });
    }
  };

  useEffect(() => {
    if (room?.status === 'waiting' && room.players.length >= 4) {
      startGame();
    }
  }, [room, startGame]);

  useEffect(() => {
    if (room?.status === 'playing' && currentPlayer?.role && !showInitialRoleReveal) {
      setShowInitialRoleReveal(true);
    }
  }, [room?.status, currentPlayer?.role]);

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl text-white mb-2">Cercle Introuvable</h2>
          <p className="text-purple-300">Ce cercle mystique n'existe pas...</p>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8"
    >
      {showInitialRoleReveal && currentPlayer.role && (
        <RoleReveal
          player={currentPlayer}
          onClose={() => setShowInitialRoleReveal(false)}
        />
      )}

      {room.status === 'playing' && currentPlayer.role && (
        <RoleButton player={currentPlayer} />
      )}

      {room.status === 'playing' ? (
        <div className="max-w-[1800px] mx-auto grid grid-cols-[1fr,auto] gap-8">
          <div className="space-y-8">
            <GameBoard room={room} />
            <GamePhases
              room={room}
              currentPlayer={currentPlayer}
              onSelectIngredient={handleSelectIngredient}
              onVote={handleVote}
              onNextPhase={nextPhase}
            />
          </div>
          <PlayersList room={room} currentPlayer={currentPlayer} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="text-center py-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-purple-300">
                En attente de plus de joueurs...
                <br />
                <span className="text-sm">
                  (Minimum 4 joueurs requis)
                </span>
              </p>
            </motion.div>
          </Card>
          <AiControls room={room} />
        </div>
      )}
    </motion.div>
  );
};