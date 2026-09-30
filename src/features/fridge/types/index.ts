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

export interface IngredientUpdateRequest {
  // 카탈로그 재료는 null이면 카탈로그 이름 사용, 직접 입력 재료는 필수
  customName: string | null;
  // 전체(최초) 수량. 남은 수량은 서버가 이미 소진·폐기한 양을 빼서 다시 계산
  quantity: number;
  unitId: number;
  storageMethodId: number;
  purchasedOn: string;
  expiresOn: string;
}

export interface IngredientUpdateApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    customName: string | null;
    quantity: number;
    unitId: number;
    storageMethodId: number;
    purchasedOn: string;
    expiresOn: string;
    statusCode: string;
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}
