import { create } from 'zustand';
import { GameState, Player, Room } from '../types/game';

interface GameStore extends GameState {
  setCurrentPlayer: (player: Player | null) => void;
  addRoom: (room: Room) => void;
  joinRoom: (roomId: string, player: Player) => void;
  leaveRoom: (roomId: string, playerId: string) => void;
  updateRoom: (roomId: string, updatedRoom: Room) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentPlayer: null,
  rooms: [],
  activeRoom: null,
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  joinRoom: (roomId, player) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId
          ? { ...room, players: [...room.players, player] }
          : room
      ),
      activeRoom: state.activeRoom?.id === roomId
        ? { ...state.activeRoom, players: [...state.activeRoom.players, player] }
        : state.activeRoom,
    })),
  leaveRoom: (roomId, playerId) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId
          ? { ...room, players: room.players.filter((p) => p.id !== playerId) }
          : room
      ),
      activeRoom: state.activeRoom?.id === roomId
        ? { ...state.activeRoom, players: state.activeRoom.players.filter((p) => p.id !== playerId) }
        : state.activeRoom,
    })),
  updateRoom: (roomId, updatedRoom) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? updatedRoom : room
      ),
      activeRoom: state.activeRoom?.id === roomId ? updatedRoom : state.activeRoom,
    })),
}));