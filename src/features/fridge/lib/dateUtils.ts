import { FridgeItemStatus } from '../types';

/**
 * 두 날짜 사이의 일수 차이를 계산
 */
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
