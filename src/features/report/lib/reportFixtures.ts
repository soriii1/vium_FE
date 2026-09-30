import { MonthlyReport, WastedItemRank } from '../types';

/**
 * 리포트 API 연동 전까지 사용하는 임시 데이터입니다.
 * 월마다 다른 값이 나오되, 같은 월은 항상 같은 값이 나오도록 연·월을 시드로 생성합니다.
 * 백엔드 리포트 API(/api/me/waste-reports, /api/me/waste-patterns) 연동이 완료되면 제거하세요.
 */
const WASTE_CATEGORIES = ['채소류', '유제품', '냉동식품', '고기류', '과일류', '수산물'];

const WASTED_ITEMS: { name: string; purchaseAmount: number }[] = [
  { name: '냉동 치즈볼', purchaseAmount: 8000 },
  { name: '샤브샤브 밀키트', purchaseAmount: 12900 },
  { name: '아스파라거스', purchaseAmount: 6500 },
  { name: '무지방 우유', purchaseAmount: 3200 },
  { name: '애호박', purchaseAmount: 1800 },
  { name: '딸기', purchaseAmount: 9900 },
  { name: '훈제 연어', purchaseAmount: 11000 },
  { name: '그릭 요거트', purchaseAmount: 5400 },
  { name: '양상추', purchaseAmount: 2500 },
  { name: '냉동 만두', purchaseAmount: 7900 },
];

// 시드 기반 난수 (mulberry32)
const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffle = <T,>(items: T[], random: () => number) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const between = (random: () => number, min: number, max: number, step = 1) =>
  Math.round((min + random() * (max - min)) / step) * step;

export const getMonthlyReportFixture = (year: number, month: number): MonthlyReport => {
  const random = createRandom(year * 100 + month);

  const registeredCount = between(random, 20, 40);
  const consumedCount = Math.round(registeredCount * between(random, 60, 85) / 100);

  const wasteCategories = shuffle(WASTE_CATEGORIES, random)
    .slice(0, 4)
    .map((category) => ({ category, wastedAmount: between(random, 1000, 16000, 100) }));

  const topWastedItems: WastedItemRank[] = shuffle(WASTED_ITEMS, random)
    .slice(0, 3)
    .map((item) => ({ ...item, wastePercent: between(random, 40, 100, 10) }))
    .sort((a, b) => b.purchaseAmount * b.wastePercent - a.purchaseAmount * a.wastePercent)
    .map((item, index) => ({
      rank: index + 1,
      name: item.name,
      purchaseAmount: item.purchaseAmount,
      wastePercent: item.wastePercent,
      lossAmount: Math.round((item.purchaseAmount * item.wastePercent) / 100 / 100) * 100,
    }));

  return {
    year,
    month,
    totalSpent: between(random, 150000, 320000, 10),
    totalWasted: wasteCategories.reduce((sum, category) => sum + category.wastedAmount, 0),
    registeredCount,
    consumedCount,
    expiredCount: registeredCount - consumedCount,
    wasteCategories,
    topWastedItems,
  };
};
