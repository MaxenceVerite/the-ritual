import { useState, useCallback, useEffect } from 'react';
import { Player, Room, GamePhase, Ingredient } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { getAiIngredient, getAiVote } from '../utils/aiLogic';
import { assignRoles } from '../utils/roleUtils';

export const useGameTurn = (roomId: string) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  
  const { rooms, updateRoom } = useGameStore();
  const room = rooms.find((r) => r.id === roomId);

  const startGame = useCallback(() => {
    if (!room) return;

    const playersWithRoles = assignRoles(room.players);

    updateRoom(roomId, {
      ...room,
      status: 'playing',
      currentPhase: 'preparation',
      currentRound: 1,
      cauldronIngredients: [],
      players: playersWithRoles,
      revealedIngredients: [],
    });
  }, [room, roomId, updateRoom]);

  const nextPhase = useCallback(() => {
    if (!room) return;

    const phases: GamePhase[] = ['preparation', 'debate', 'voting', 'revelation'];
    const currentPhaseIndex = phases.indexOf(room.currentPhase || 'preparation');
    const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    const isNewRound = nextPhase === 'preparation';
    
    // Reset player states for the new phase
    const updatedPlayers = room.players.map(player => ({
      ...player,
      selectedIngredient: undefined,
      hasVoted: false,
      abilities: player.abilities ? {
        ...player.abilities,
        ...Object.fromEntries(
          Object.entries(player.abilities).map(([name, ability]) => [
            name,
            {
              ...ability,
              lastUsedRound: isNewRound ? undefined : ability.lastUsedRound,
            },
          ])
        ),
      } : undefined,
    }));

    const updatedRoom = {
      ...room,
      currentPhase: nextPhase,
      currentRound: isNewRound ? (room.currentRound || 1) + 1 : room.currentRound,
      votingResults: nextPhase === 'voting' ? {} : room.votingResults,
      players: updatedPlayers,
    };

    updateRoom(roomId, updatedRoom);
  }, [room, roomId, updateRoom]);

  // Gestion des actions IA
  useEffect(() => {
    if (!room || !room.aiEnabled) return;

    const aiPlayers = room.players.filter(p => p.type === 'ai');
    
    // Phase de préparation : les IA choisissent leurs ingrédients
    if (room.currentPhase === 'preparation') {
      const delay = setTimeout(() => {
        const updatedPlayers = room.players.map(player => {
          if (player.type === 'ai' && !player.selectedIngredient && player.isAlive) {
            return {
              ...player,
              selectedIngredient: getAiIngredient(room, player),
            };
          }
          return player;
        });

        const allPlayersSelected = updatedPlayers.every(p => 
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
          updateRoom(roomId, updatedRoom);
          nextPhase();
        } else {
          updateRoom(roomId, { ...room, players: updatedPlayers });
        }
      }, 1000);

      return () => clearTimeout(delay);
    }

    // Phase de vote : les IA votent
    if (room.currentPhase === 'voting') {
      const delay = setTimeout(() => {
        const updatedPlayers = room.players.map(player => {
          if (player.type === 'ai' && !player.hasVoted && player.isAlive) {
            return { ...player, hasVoted: true };
          }
          return player;
        });

        const votingResults = {
          ...room.votingResults,
          ...Object.fromEntries(
            aiPlayers
              .filter(p => p.isAlive && !p.hasVoted)
              .map(p => [p.id, getAiVote(room, p)])
          ),
        };

        const allPlayersVoted = updatedPlayers.every(p => 
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

          const playersAfterVote = updatedPlayers.map(player =>
            player.id === eliminatedId ? { ...player, isAlive: false } : player
          );

          updateRoom(roomId, {
            ...room,
            players: playersAfterVote,
            votingResults: {},
          });
          nextPhase();
        } else {
          updateRoom(roomId, {
            ...room,
            players: updatedPlayers,
            votingResults,
          });
        }
      }, 1500);

      return () => clearTimeout(delay);
    }
  }, [room, roomId, updateRoom, nextPhase]);

  return {
    selectedPlayer,
    selectedIngredient,
    setSelectedPlayer,
    setSelectedIngredient,
    startGame,
    nextPhase,
  };
};