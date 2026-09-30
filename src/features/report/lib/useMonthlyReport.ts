import { useMemo } from 'react';
import { getMonthlyReportFixture } from './reportFixtures';

// 리포트 API 연동 전까지는 월별 임시 데이터로 화면을 보여줍니다.
export const useMonthlyReport = (year: number, month: number) => {
  const report = useMemo(() => getMonthlyReportFixture(year, month), [year, month]);

  return {
    report,
    isLoading: false,
    error: null as string | null,
  };
};
