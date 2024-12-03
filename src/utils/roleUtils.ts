import { Role, roles } from '../data/roles';
import { Player, RoleType, Room } from '../types/game';

export const assignRoles = (players: Player[]): Player[] => {
  const playerCount = players.length;
  let availableRoles: RoleType[] = [];

  // Configuration des rôles selon le nombre de joueurs
  if (playerCount === 4) {
    availableRoles = ['alchemist', 'seer', 'darkWitch', 'collector'];
  } else if (playerCount === 5) {
    availableRoles = ['alchemist', 'purifier', 'seer', 'darkWitch', 'shapeshifter'];
  } else if (playerCount === 6) {
    availableRoles = ['alchemist', 'purifier', 'seer', 'nose', 'darkWitch', 'shapeshifter'];
  } else {
    // Configuration par défaut pour d'autres nombres de joueurs
    const whiteCount = Math.ceil(playerCount * 0.5);
    const darkCount = Math.floor(playerCount * 0.3);
    const hermitCount = playerCount - whiteCount - darkCount;

    availableRoles = [
      ...Array(whiteCount).fill('alchemist'),
      ...Array(darkCount).fill('darkWitch'),
      ...Array(hermitCount).fill('collector'),
    ] as RoleType[];
  }

  // Mélange des rôles
  const shuffledRoles = availableRoles.sort(() => Math.random() - 0.5);

  // Attribution des rôles aux joueurs
  return players.map((player, index) => ({
    ...player,
    role: shuffledRoles[index],
    isAlive: true,
    abilities: roles[shuffledRoles[index]].abilities.reduce((acc, ability) => ({
      ...acc,
      [ability.name]: {
        usesLeft: ability.usesPerGame || ability.usesPerRound || 0,
      },
    }), {}),
    collectedIngredients: shuffledRoles[index] === 'collector' ? [] : undefined,
  }));
};

export const canUseAbility = (
  player: Player,
  abilityName: string,
  currentRound: number
): boolean => {
  const ability = player.abilities?.[abilityName];
  if (!ability) return false;

  const roleAbility = roles[player.role!].abilities.find(a => a.name === abilityName);
  if (!roleAbility) return false;

  if (roleAbility.usesPerGame && ability.usesLeft <= 0) return false;
  if (roleAbility.usesPerRound && ability.lastUsedRound === currentRound) return false;

  return true;
};

export const useAbility = (
  player: Player,
  abilityName: string,
  currentRound: number
): Player => {
  if (!canUseAbility(player, abilityName, currentRound)) return player;

  const ability = player.abilities![abilityName];
  const roleAbility = roles[player.role!].abilities.find(a => a.name === abilityName);

  return {
    ...player,
    abilities: {
      ...player.abilities,
      [abilityName]: {
        usesLeft: ability.usesLeft - 1,
        lastUsedRound: currentRound,
      },
    },
  };
};

export const getRoleInfo = (role: RoleType): Role => {
  return roles[role];
};