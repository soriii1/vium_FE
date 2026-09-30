import { getIngredientImage } from '@/features/fridge';
import {
  RecipeCategory,
  RecipeCategoryCode,
  RecipeDetail,
  RecipeDetailApiResponse,
  RecipeListItem,
  RecommendedRecipesApiResponse,
} from '../types';

const CODE_BY_CATEGORY: Record<RecipeCategory, RecipeCategoryCode> = {
  전체: 'ALL',
  한식: 'KOREAN',
  중식: 'CHINESE',
  양식: 'WESTERN',
  일식: 'JAPANESE',
  디저트: 'DESSERT',
};

const CATEGORY_BY_CODE = Object.fromEntries(
  Object.entries(CODE_BY_CATEGORY).map(([category, code]) => [code, category])
) as Record<RecipeCategoryCode, RecipeCategory>;

export const toCategoryCode = (category: RecipeCategory) => CODE_BY_CATEGORY[category];

type RecipeCard = NonNullable<RecommendedRecipesApiResponse['data']>['recipes'][number];
type RecipeDetailData = NonNullable<RecipeDetailApiResponse['data']>;

export const mapRecipeCard = (card: RecipeCard): RecipeListItem => ({
  id: card.recipeId,
  title: card.title,
  cookTimeMinutes: card.cookTime,
  category: CATEGORY_BY_CODE[card.category] ?? '전체',
  tags: card.usedIngredients.slice(0, 3).map((ingredient) => `#${ingredient.name}`),
});

export const mapRecipeDetail = (detail: RecipeDetailData): RecipeDetail => ({
  id: detail.recipeId,
  title: detail.title,
  cookTimeMinutes: detail.cookTime,
  category: CATEGORY_BY_CODE[detail.category] ?? '전체',
  image: detail.imageUrl ?? undefined,
  tags: detail.ingredients.slice(0, 3).map((ingredient) => `#${ingredient.name}`),
  // 같은 카탈로그 재료가 두 번 나올 수 있어 순번을 id로 사용
  ingredients: detail.ingredients.map((ingredient, index) => ({
    id: index + 1,
    name: ingredient.name,
    image: getIngredientImage(ingredient.name),
    inventoryId: ingredient.inventoryId,
  })),
  steps: detail.steps,
});
