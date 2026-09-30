export type FridgeItemStatus = '위험' | '보통' | '양호';

export interface FridgeItem {
  id: number;
  title: string;
  subtitle: string;
  status: FridgeItemStatus;
  remainingQuantity: number;
  image?: string;
}

export interface FridgeItemDetail extends FridgeItem {
  quantity: string;
  price: string;
  registeredDate: string;
  expirationDate: string;
}

export interface IngredientApiResponse {
  inventoryItemId: number;
  ingredientCatalogId: number | null;
  name: string;
  categoryName: string | null;
  initialQuantity: number;
  remainingQuantity: number;
  amount: number | null;
  unitId: number;
  unit: string;
  statusCode: string;
  purchasedOn: string;
  expiresOn: string;
}

export interface IngredientsListApiResponse {
  success: boolean;
  data: {
    ingredients: IngredientApiResponse[];
  };
  error: null | {
    code: string;
    message: string;
  };
}

export interface IngredientRegisterRequest {
  ingredientCatalogId?: number;
  customName?: string;
  quantity: number;
  unitId: number;
  storageMethodId?: number;
  purchasedOn?: string;
  expiresOn?: string;
  amount?: number;
}

export interface IngredientRegisterApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    ingredientCatalogId: number | null;
    customName: string | null;
    initialQuantity: number;
    remainingQuantity: number;
    unitId: number;
    storageMethodId: number | null;
    statusCode: string;
    purchasedOn: string;
    expiresOn: string;
  };
  error: null | {
    code: string;
    message: string;
  };
}

export type IngredientStatusCode = 'consumed' | 'disposed';

export interface IngredientStatusUpdateRequest {
  status: IngredientStatusCode;
  quantity: number;
  wasteQuantity?: number;
  wasteAmount?: number;
}

export interface IngredientStatusUpdateApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    statusCode: IngredientStatusCode;
    remainingQuantity: number;
    wasteQuantity?: number;
    wasteAmount?: number;
  };
  error: null | {
    code: string;
    message: string;
  };
}
