export type RoleType =
  | 'alchemist'
  | 'purifier'
  | 'seer'
  | 'nose'
  | 'darkWitch'
  | 'shapeshifter'
  | 'collector';

export type RoleAlignment = 'white' | 'dark' | 'hermit';
export type GamePhase = 'preparation' | 'debate' | 'voting' | 'revelation';
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type IngredientType = 'plants' | 'fluids' | 'ethereal' | 'organs';
export type PlayerType = 'human' | 'ai';

export interface Ingredient {
  id: string;
  name: string;
  type: IngredientType;
}

export interface RoleAbility {
  name: string;
  description: string;
  usesPerGame?: number;
  usesPerRound?: number;
  currentUses?: number;
}

export interface Player {
  id: string;
  username: string;
  type: PlayerType;
  role?: RoleType;
  isHost?: boolean;
  isAlive?: boolean;
  selectedIngredient?: Ingredient;
  hasVoted?: boolean;
  abilities?: {
    [key: string]: {
      usesLeft: number;
      lastUsedRound?: number;
    };
  };
  collectedIngredients?: Ingredient[];
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  status: GameStatus;
  maxPlayers: number;
  currentPhase?: GamePhase;
  currentRound?: number;
  currentRecipe?: Ingredient[];
  cauldronIngredients: Ingredient[];
  votingResults?: Record<string, string>;
  aiEnabled?: boolean;
  revealedIngredients?: {
    roundId: number;
    ingredients: Ingredient[];
  }[];
}

// Nouveau type et interface pour la gestion des recettes et des règles
export type RecipeRuleType =
  | 'majority' // Majorité d'un ingrédient spécifique
  | 'minority' // Minorité d'un ingrédient spécifique
  | 'exact' // Un ingrédient spécifique doit apparaître un nombre exact de fois
  | 'noMoreThan' // Un ingrédient ne doit pas apparaître plus de X fois
  | 'mustInclude'; // Un ingrédient spécifique doit être présent au moins une fois

export interface RecipeRule {
  type: RecipeRuleType;
  ingredient?: Ingredient; // L'ingrédient concerné par la règle
  quantity?: number; // Quantité spécifique (pour 'exact', 'noMoreThan', etc.)
}

export interface Recipe {
  rules: RecipeRule[]; // Liste des règles de la recette
}

// Nouvelle interface pour la gestion de la validation de la potion
export function generateRandomRecipe(ingredients: Ingredient[]): Recipe {
  const rules: RecipeRule[] = [];
  const ingredientTypes = ['plants', 'fluids', 'ethereal', 'organs'];

  const numberOfRules = Math.floor(Math.random() * 3) + 2;

  for (let i = 0; i < numberOfRules; i++) {
    const randomRuleType = Math.random();
    let rule: RecipeRule = {
      type: 'mustInclude',
      ingredient: ingredients[Math.floor(Math.random() * ingredients.length)],
    };

    if (randomRuleType < 0.2) {
      const randomType =
        ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];
      rule = {
        type: 'majority',
        ingredient: ingredients.filter((ing) => ing.type === randomType)[
          Math.floor(
            Math.random() *
              ingredients.filter((ing) => ing.type === randomType).length
          )
        ],
      };
    } else if (randomRuleType < 0.4) {
      const randomType =
        ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];
      rule = {
        type: 'minority',
        ingredient: ingredients.filter((ing) => ing.type === randomType)[
          Math.floor(
            Math.random() *
              ingredients.filter((ing) => ing.type === randomType).length
          )
        ],
      };
    } else if (randomRuleType < 0.6) {
      const randomIngredient =
        ingredients[Math.floor(Math.random() * ingredients.length)];
      rule = { type: 'exact', ingredient: randomIngredient, quantity: 1 };
    } else if (randomRuleType < 0.8) {
      const randomIngredient =
        ingredients[Math.floor(Math.random() * ingredients.length)];
      rule = { type: 'noMoreThan', ingredient: randomIngredient, quantity: 2 };
    } else {
      const randomIngredient =
        ingredients[Math.floor(Math.random() * ingredients.length)];
      rule = { type: 'mustInclude', ingredient: randomIngredient };
    }

    rules.push(rule);
  }

  return { rules };
}

// Fonction de validation de la potion
export function validatePotion(
  potionIngredients: Ingredient[],
  recipe: Recipe
): boolean {
  const ingredientCounts = potionIngredients.reduce((acc, ingredient) => {
    acc[ingredient.name] = (acc[ingredient.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  for (const rule of recipe.rules) {
    switch (rule.type) {
      case 'majority':
        const majorityCount = potionIngredients.filter(
          (ing) => ing.name === rule.ingredient?.name
        ).length;
        if (majorityCount <= potionIngredients.length / 2) return false;
        break;

      case 'minority':
        const minorityCount = potionIngredients.filter(
          (ing) => ing.name === rule.ingredient?.name
        ).length;
        if (minorityCount >= potionIngredients.length / 2) return false;
        break;

      case 'exact':
        const exactCount = ingredientCounts[rule.ingredient?.name || ''] || 0;
        if (exactCount !== rule.quantity) return false;
        break;

      case 'noMoreThan':
        const noMoreThanCount =
          ingredientCounts[rule.ingredient?.name || ''] || 0;
        if (noMoreThanCount > rule.quantity!) return false;
        break;

      case 'mustInclude':
        if (!ingredientCounts[rule.ingredient?.name || '']) return false;
        break;
    }
  }

  return true;
}

export interface GameState {
  currentPlayer: Player | null;
  rooms: Room[];
  activeRoom: Room | null;
}
