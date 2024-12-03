import { RoleType, RoleAlignment, RoleAbility } from '../types/game';

export interface Role {
  type: RoleType;
  name: string;
  alignment: RoleAlignment;
  description: string;
  objective: string;
  abilities: RoleAbility[];
}

export const roles: Record<RoleType, Role> = {
  alchemist: {
    type: 'alchemist',
    name: 'Alchimiste',
    alignment: 'white',
    description: 'Une sorcière blanche dévouée à la réussite du rituel',
    objective: 'Concoctez des potions réussies et démasquez les sorcières noires',
    abilities: [],
  },
  purifier: {
    type: 'purifier',
    name: 'Purificatrice',
    alignment: 'white',
    description: 'Gardienne du Sel des Anges, capable de purifier une potion',
    objective: 'Utilisez votre Sel des Anges au moment crucial pour sauver une potion',
    abilities: [{
      name: 'Sel des Anges',
      description: 'Garantit la réussite d\'une potion',
      usesPerGame: 1,
    }],
  },
  seer: {
    type: 'seer',
    name: 'Voyante',
    alignment: 'white',
    description: 'Capable de percer les secrets des autres sorcières',
    objective: 'Utilisez votre don de vision pour identifier les sorcières noires',
    abilities: [{
      name: 'Vision Mystique',
      description: 'Révèle le rôle d\'un autre joueur',
      usesPerRound: 1,
    }],
  },
  nose: {
    type: 'nose',
    name: 'Le Nez',
    alignment: 'white',
    description: 'Possède un odorat surnaturel pour détecter les ingrédients',
    objective: 'Identifiez les ingrédients ajoutés à la potion pour guider le cercle',
    abilities: [{
      name: 'Odorat Mystique',
      description: 'Révèle les ingrédients ajoutés au chaudron',
      usesPerRound: 1,
    }],
  },
  darkWitch: {
    type: 'darkWitch',
    name: 'Sorcière Noire',
    alignment: 'dark',
    description: 'Une servante des ténèbres cherchant à corrompre le rituel',
    objective: 'Sabotez les potions pour faire échouer le rituel et invoquer le démon',
    abilities: [],
  },
  shapeshifter: {
    type: 'shapeshifter',
    name: 'Métamorphe',
    alignment: 'dark',
    description: 'Maîtresse de la transmutation, capable de corrompre les ingrédients',
    objective: 'Transformez les ingrédients en plomb pour saboter les potions',
    abilities: [{
      name: 'Transmutation',
      description: 'Transforme l\'ingrédient d\'un joueur en plomb',
      usesPerRound: 1,
    }],
  },
  collector: {
    type: 'collector',
    name: 'Collectionneuse',
    alignment: 'hermit',
    description: 'Une ermite obsédée par la collection d\'ingrédients rares',
    objective: 'Collectez tous les types d\'ingrédients pour devenir la Sachante',
    abilities: [{
      name: 'Imitation',
      description: 'Copie l\'ingrédient d\'un autre joueur',
      usesPerRound: 1,
    }],
  },
};