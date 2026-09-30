import { FridgeItemDetail, FridgeItemStatus } from '../types';
import { IngredientApiResponse } from '../types';
import { getDaysDifference, formatDate, formatDateWithSuffix } from './dateUtils';
import { getIngredientImage } from './ingredientImageFixtures';

export const mapIngredientToFridgeItem = (ingredient: IngredientApiResponse): FridgeItemDetail => {
  const daysLeft = getDaysDifference(ingredient.expiresOn);

  const status: FridgeItemStatus = daysLeft <= 5 ? '위험' : daysLeft <= 14 ? '보통' : '양호';

  const subtitle = daysLeft < 0
    ? `소비기한 D+${Math.abs(daysLeft)}`
    : daysLeft === 0
    ? '소비기한 D-Day'
    : `소비기한 D-${daysLeft}`;

  const quantity = `${ingredient.remainingQuantity}${ingredient.unit}`;
  const price = ingredient.amount != null ? `${ingredient.amount.toLocaleString('ko-KR')}원` : '-';

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle,
    status,
    remainingQuantity: ingredient.remainingQuantity,
    image: getIngredientImage(ingredient.name),
    quantity,
    price,
    registeredDate: formatDate(ingredient.purchasedOn),
    expirationDate: formatDateWithSuffix(ingredient.expiresOn),
  };
};

export const mapIngredientsToFridgeItems = (
  ingredients: IngredientApiResponse[]
): FridgeItemDetail[] => {
  return ingredients.map(mapIngredientToFridgeItem);
};
