import { Player, Room, Ingredient, RoleType } from '../types/game';
import { ingredients } from '../data/ingredients';
import { getRoleInfo } from './roleUtils';

// Stratégies de jeu pour les IA selon leur alignement
const getIngredientByStrategy = (room: Room, player: Player): Ingredient => {
  const roleInfo = player.role ? getRoleInfo(player.role) : null;
  
  if (!roleInfo) return ingredients[0];

  switch (roleInfo.alignment) {
    case 'white':
      // Les sorcières blanches préfèrent les ingrédients bénéfiques
      const healingIngredients = ingredients.filter(i => i.type === 'healing');
      return healingIngredients[Math.floor(Math.random() * healingIngredients.length)];
    
    case 'dark':
      // Les sorcières noires préfèrent les ingrédients toxiques
      const poisonIngredients = ingredients.filter(i => i.type === 'poison');
      return poisonIngredients[Math.floor(Math.random() * poisonIngredients.length)];
    
    case 'hermit':
      // Les ermites choisissent des ingrédients en fonction de leur collection
      if (player.role === 'collector' && player.collectedIngredients) {
        const missingIngredients = ingredients.filter(
          i => !player.collectedIngredients?.some(ci => ci.id === i.id)
        );
        if (missingIngredients.length > 0) {
          return missingIngredients[Math.floor(Math.random() * missingIngredients.length)];
        }
      }
      return ingredients[Math.floor(Math.random() * ingredients.length)];
    
    default:
      return ingredients[Math.floor(Math.random() * ingredients.length)];
  }
};

// Logique de vote pour les IA
export const getAiVote = (room: Room, aiPlayer: Player): string => {
  const alivePlayers = room.players.filter(p => p.isAlive && p.id !== aiPlayer.id);
  const roleInfo = aiPlayer.role ? getRoleInfo(aiPlayer.role) : null;
  
  if (!roleInfo || alivePlayers.length === 0) {
    return alivePlayers[0]?.id || aiPlayer.id;
  }

  switch (roleInfo.alignment) {
    case 'dark':
      // Les sorcières noires ciblent les sorcières blanches
      const whitePlayers = alivePlayers.filter(p => {
        const playerRole = p.role ? getRoleInfo(p.role) : null;
        return playerRole?.alignment === 'white';
      });
      if (whitePlayers.length > 0) {
        return whitePlayers[Math.floor(Math.random() * whitePlayers.length)].id;
      }
      break;

    case 'white':
      // Les sorcières blanches ciblent les joueurs suspects
      const suspectPlayers = alivePlayers.filter(p => {
        const playerRole = p.role ? getRoleInfo(p.role) : null;
        return playerRole?.alignment === 'dark' || !playerRole;
      });
      if (suspectPlayers.length > 0) {
        return suspectPlayers[Math.floor(Math.random() * suspectPlayers.length)].id;
      }
      break;
  }
  
  // Vote aléatoire par défaut
  return alivePlayers[Math.floor(Math.random() * alivePlayers.length)].id;
};

// Sélection d'ingrédient pour les IA
export const getAiIngredient = (room: Room, aiPlayer: Player): Ingredient => {
  return getIngredientByStrategy(room, aiPlayer);
};

// Noms pour les IA
const aiNames = [
  'Morgana', 'Circé', 'Hécate', 'Médée', 'Viviane',
  'Nimue', 'Calypso', 'Maleficent', 'Grimalkin', 'Sybille'
];

export const generateAiPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `ai-${crypto.randomUUID()}`,
    username: aiNames[index % aiNames.length],
    type: 'ai',
    isAlive: true,
  }));
};