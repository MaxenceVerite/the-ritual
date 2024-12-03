import { Ingredient } from '../types/game';

export const ingredients: Ingredient[] = [
  {
    id: 'healing-herbs',
    name: 'Herbes Curatives',
    type: 'healing',
    effect: 'Purifie la potion',
  },
  {
    id: 'nightshade',
    name: 'Belladone',
    type: 'poison',
    effect: 'Corrompt la potion',
  },
  {
    id: 'moonflower',
    name: 'Fleur de Lune',
    type: 'neutral',
    effect: 'Amplifie l\'effet dominant',
  },
  {
    id: 'dragons-breath',
    name: 'Souffle de Dragon',
    type: 'healing',
    effect: 'Stabilise la potion',
  },
  {
    id: 'shadow-essence',
    name: 'Essence d\'Ombre',
    type: 'poison',
    effect: 'Déstabilise la potion',
  },
];