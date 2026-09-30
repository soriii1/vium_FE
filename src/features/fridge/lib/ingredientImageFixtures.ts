/**
 * 이미지 서버 연동 전까지 쓰는 식재료 임시 사진 (TheMealDB 공개 식재료 이미지)
 * 이미지 API가 생기면 응답의 이미지 URL로 교체하고 이 파일은 제거하세요.
 */
const BASE_URL = 'https://www.themealdb.com/images/ingredients';

// 앞에 있을수록 우선 매칭 (예: '양파'가 '파'보다, '파스타'가 '파'보다 먼저)
const KEYWORD_TO_IMAGE: [string, string][] = [
  ['파스타', 'Spaghetti'],
  ['스파게티', 'Spaghetti'],
  ['양파', 'Onion'],
  ['쪽파', 'Spring Onions'],
  ['대파', 'Spring Onions'],
  ['당근', 'Carrots'],
  ['감자', 'Potatoes'],
  ['우유', 'Milk'],
  ['두부', 'Tofu'],
  ['계란', 'Eggs'],
  ['달걀', 'Eggs'],
  ['버섯', 'Mushrooms'],
  ['크림치즈', 'Cream Cheese'],
  ['치즈', 'Cheese'],
  ['토마토', 'Tomatoes'],
  ['연어', 'Salmon'],
  ['돼지', 'Pork'],
  ['삼겹', 'Pork'],
  ['소고기', 'Beef'],
  ['쇠고기', 'Beef'],
  ['치킨', 'Chicken'],
  ['닭', 'Chicken'],
  ['베이컨', 'Bacon'],
  ['버터', 'Butter'],
  ['바나나', 'Banana'],
  ['요거트', 'Greek Yogurt'],
  ['요구르트', 'Yogurt'],
  ['밀가루', 'Flour'],
  ['간장', 'Soy Sauce'],
  ['마늘', 'Garlic'],
  ['식빵', 'Bread'],
  ['빵', 'Bread'],
  ['사과', 'Apple'],
  ['양배추', 'Cabbage'],
  ['오이', 'Cucumber'],
  ['시금치', 'Spinach'],
  ['새우', 'Prawns'],
  ['설탕', 'Sugar'],
  ['꿀', 'Honey'],
  ['고추', 'Red Chilli'],
  ['생크림', 'Double Cream'],
  ['당면', 'Rice Vermicelli'],
  ['브로콜리', 'Broccoli'],
  ['레몬', 'Lemon'],
  ['상추', 'Lettuce'],
  ['애호박', 'Zucchini'],
  ['호박', 'Zucchini'],
  ['쌀', 'Rice'],
  ['밥', 'Rice'],
];

/**
 * 재료 이름에 맞는 임시 사진 URL (매칭되는 재료가 없으면 undefined → 회색 빈칸)
 * @param size small: 목록·카드용(약 100px), large: 상세 화면용
 */
export const getIngredientImage = (name: string, size: 'small' | 'large' = 'small') => {
  const match = KEYWORD_TO_IMAGE.find(([keyword]) => name.includes(keyword));
  if (!match) return undefined;
  const fileName = encodeURIComponent(match[1]);
  return size === 'small' ? `${BASE_URL}/${fileName}-Small.png` : `${BASE_URL}/${fileName}.png`;
};
