import { FridgeItemDetail, FridgeItemStatus } from '../types';
import { IngredientApiResponse } from '../types';
import { getDaysDifference, formatDate, formatDateWithSuffix } from './dateUtils';

/**
 * 백엔드 API 응답을 프론트엔드 FridgeItemDetail 형태로 변환
 */
export const mapIngredientToFridgeItem = (ingredient: IngredientApiResponse): FridgeItemDetail => {
  // 날짜 차이를 한 번만 계산
  const daysLeft = getDaysDifference(ingredient.expiresOn);

  // 상태 계산
  const status: FridgeItemStatus = daysLeft <= 5 ? '위험' : daysLeft <= 14 ? '보통' : '양호';

  // D-day 포맷
  const subtitle = daysLeft < 0
    ? `소비기한 D+${Math.abs(daysLeft)}`
    : daysLeft === 0
    ? '소비기한 D-Day'
    : `소비기한 D-${daysLeft}`;

  const quantity = `${ingredient.remainingQuantity}${ingredient.unit}`;
  const price = '3,000원';

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle,
    status,
    remainingQuantity: ingredient.remainingQuantity,
    quantity,
    price,
    registeredDate: formatDate(ingredient.purchasedOn),
    expirationDate: formatDateWithSuffix(ingredient.expiresOn),
  };
};

/**
 * 여러 재료를 한 번에 변환
 */
export const mapIngredientsToFridgeItems = (
  ingredients: IngredientApiResponse[]
): FridgeItemDetail[] => {
  return ingredients.map(mapIngredientToFridgeItem);
};
