export type RecipeCategory = '전체' | '한식' | '중식' | '양식' | '일식' | '디저트';

// 백엔드 카테고리 코드 (요청 파라미터·응답 모두 이 값을 사용)
export type RecipeCategoryCode = 'ALL' | 'KOREAN' | 'CHINESE' | 'WESTERN' | 'JAPANESE' | 'DESSERT';

export interface RecipeIngredient {
  id: number;
  name: string;
  image?: string;
  // 내 냉장고 재고 id — 냉장고에 없는 재료는 null (요리 완료 시 차감 대상에서 제외)
  inventoryId?: number | null;
}

export interface RecipeStep {
  step: number;
  description: string;
}

export interface RecipeListItem {
  id: number;
  title: string;
  cookTimeMinutes: number;
  tags: string[];
  category: RecipeCategory;
  image?: string;
}

export interface RecipeDetail extends RecipeListItem {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

interface ApiError {
  code: string;
  message: string;
}

export interface RecommendedRecipesApiResponse {
  success: boolean;
  data: {
    recipes: {
      recipeId: number;
      title: string;
      category: RecipeCategoryCode;
      cookTime: number;
      usedIngredients: { ingredientCatalogId: number; name: string }[];
    }[];
  } | null;
  error: ApiError | null;
}

export interface RecipeDetailApiResponse {
  success: boolean;
  data: {
    recipeId: number;
    title: string;
    category: RecipeCategoryCode;
    cookTime: number;
    imageUrl: string | null;
    ingredients: { ingredientCatalogId: number; inventoryId: number | null; name: string }[];
    steps: { step: number; description: string }[];
  } | null;
  error: ApiError | null;
}

export interface RecipeCompleteRequest {
  // usageRate: 남은 재고 중 이번 요리에 사용한 비율 (0~100)
  usages: { inventoryId: number; usageRate: number }[];
}
