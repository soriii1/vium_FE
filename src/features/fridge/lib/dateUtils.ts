import { FridgeItemStatus } from '../types';

export const getDaysDifference = (targetDate: string, baseDate?: Date): number => {
  // ISO 형식의 날짜 문자열을 로컬 날짜로 파싱
  const targetParts = targetDate.split('T')[0].split('-');
  const target = new Date(
    parseInt(targetParts[0]),
    parseInt(targetParts[1]) - 1,
    parseInt(targetParts[2])
  );

  const base = baseDate || new Date();
  const baseParts = [
    base.getFullYear(),
    base.getMonth(),
    base.getDate()
  ];
  const baseLocal = new Date(baseParts[0], baseParts[1], baseParts[2]);

  const diffTime = target.getTime() - baseLocal.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const calculateStatus = (expiresOn: string): FridgeItemStatus => {
  const daysLeft = getDaysDifference(expiresOn);

  if (daysLeft <= 5) {
    return '위험';
  } else if (daysLeft <= 14) {
    return '보통';
  } else {
    return '양호';
  }
};

/**
 * D-day 형태의 문자열 생성
 * 예: "소비기한 D-3"
 */
export const formatDday = (expiresOn: string): string => {
  const daysLeft = getDaysDifference(expiresOn);

  if (daysLeft < 0) {
    return `소비기한 D+${Math.abs(daysLeft)}`;
  } else if (daysLeft === 0) {
    return '소비기한 D-Day';
  } else {
    return `소비기한 D-${daysLeft}`;
  }
};

/**
 * 날짜를 "YYYY/MM/DD" 형태로 포맷
 */
export const formatDate = (dateString: string): string => {
  // ISO 형식의 날짜 문자열을 로컬 날짜로 파싱
  const dateParts = dateString.split('T')[0].split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  return `${year}/${month}/${day}`;
};

/**
 * 날짜를 "YYYY/MM/DD까지" 형태로 포맷
 */
export const formatDateWithSuffix = (dateString: string): string => {
  return `${formatDate(dateString)}까지`;
};

/**
 * Date → 'YYYY-MM-DD' (로컬 날짜 기준, API 요청용)
 */
export const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 'YYYY-MM-DD' → Date (로컬 자정, UTC로 해석되어 하루 밀리는 것 방지)
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
};
