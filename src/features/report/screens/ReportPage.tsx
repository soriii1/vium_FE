import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useCountUp } from '@/shared/lib/hooks/useCountUp';
import ShareIcon from '@/../assets/icons/share-icon.svg';
import { useMonthlyReport } from '../lib/useMonthlyReport';
import { formatCount, formatWon } from '../lib/formatters';
import { YearMonth, getCurrentYearMonth } from '../lib/reportMonths';
import { useReportShare } from '../lib/useReportShare';
import { ReportMonthPicker } from '../ui/ReportMonthPicker';
import { WasteBar } from '../ui/WasteBar';

const BAR_MAX_HEIGHT = 153;
const BAR_MIN_HEIGHT = 11;

export const ReportPage: React.FC = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<YearMonth>(getCurrentYearMonth);
  const { report } = useMonthlyReport(selectedMonth.year, selectedMonth.month);

  const animationKey = `${report.year}-${report.month}`;
  const captureTargetRef = useRef<View>(null);
  const { isSharing, shareAsImage } = useReportShare(captureTargetRef, animationKey);
  const displayedSpent = useCountUp(report.totalSpent, 900, animationKey);
  const displayedWasted = useCountUp(report.totalWasted, 900, animationKey);

  const maxWasted = Math.max(...report.wasteCategories.map((c) => c.wastedAmount), 1);
  const mostWasted = report.wasteCategories.find((c) => c.wastedAmount === maxWasted);

  const summaryRows = [
    { label: '등록한 재료', value: report.registeredCount },
    { label: '전부 섭취한 재료', value: report.consumedCount },
    { label: '소비기한을 지키지 못한 재료', value: report.expiredCount },
  ];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
      {/* 공유 시 이미지로 캡처되는 영역 (하단 버튼·네비게이션 제외) */}
      <View
        ref={captureTargetRef}
        collapsable={false}
        className="bg-white px-screen md:px-10 lg:px-20 pt-8 pb-8 mt-[43px] items-center"
      >
        <View className="w-full max-w-[480px] items-center gap-[50px]">
          <ReportMonthPicker value={selectedMonth} onChange={setSelectedMonth} />

          <View className="w-full gap-[54px]">
            <View className="gap-4">
              <Text className="text-[18px] font-medium font-sans text-text-100">이번달 식비</Text>
              <View className="bg-primary-300 rounded-lg p-5 gap-2">
                <Text className="text-title font-medium font-sans text-text-100 tabular-nums">
                  총 {formatWon(displayedSpent)}원
                </Text>
                <Text className="text-[12px] font-sans text-text-50 tabular-nums">
                  그중에 총 {formatWon(displayedWasted)}원치를 폐기했어요.
                </Text>
              </View>
            </View>

            <View className="px-[14px] gap-8">
              <View className="px-[5px] gap-3">
                {summaryRows.map((row) => (
                  <View key={row.label} className="flex-row items-center justify-between">
                    <Text className="text-text14 font-medium font-sans text-text-300">
                      {row.label}
                    </Text>
                    <Text className="text-text15 font-medium font-sans text-text-100">
                      {formatCount(row.value)}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="h-px bg-neutral-100" />
            </View>

            <View className="px-[7px] gap-[15px]">
              <View className="gap-4">
                <Text className="text-[18px] font-medium font-sans text-text-100">
                  <Text className="text-primary-700">{mostWasted?.category}</Text>
                  를{'\n'}가장 많이 버렸어요!
                </Text>
                <View className="flex-row items-end justify-center gap-6 p-5">
                  {report.wasteCategories.map((category, index) => (
                    <WasteBar
                      key={category.category}
                      label={category.category}
                      height={Math.max(
                        BAR_MIN_HEIGHT,
                        Math.round((category.wastedAmount / maxWasted) * BAR_MAX_HEIGHT)
                      )}
                      isHighlighted={category === mostWasted}
                      index={index}
                      animationKey={animationKey}
                    />
                  ))}
                </View>
              </View>

              <View key={animationKey} className="px-[7px] gap-[6px]">
                {report.topWastedItems.map((item, index) => (
                  <Animated.View
                    key={item.rank}
                    entering={FadeInDown.delay(400 + index * 100).duration(400)}
                  >
                    {index > 0 && <View className="h-px bg-neutral-100 mb-[6px]" />}
                    <View className="flex-row items-end justify-between p-2.5 rounded-lg bg-white">
                      <View className="flex-row items-center gap-4">
                        <Text className="text-[20px] font-bold font-sans text-text-300">
                          {item.rank}
                        </Text>
                        <View className="gap-1">
                          <Text className="text-text15 font-sans text-text-100">{item.name}</Text>
                          <Text className="text-text14 font-medium font-sans text-text-100">
                            -{formatWon(item.lossAmount)}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end gap-1">
                        <Text className="text-[12px] font-sans text-text-200">
                          구매 : {formatWon(item.purchaseAmount)}
                        </Text>
                        <Text className="text-[12px] font-sans text-text-200">
                          폐기 : {item.wastePercent}%
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="px-screen md:px-10 lg:px-20 pt-8 items-center">
        <View className="w-full max-w-[480px] gap-16 items-center">
          <Text className="text-[12px] font-sans text-text-50 text-center">
            이제 해당 내용을 바탕으로 장보기 리스트를 추천 받을 수 있어요!
          </Text>
          <View className="w-full flex-row items-center gap-4">
            <Pressable
              className="flex-1 bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px]"
              onPress={() => router.push('/main')}
            >
              <Text className="text-text-400 text-subtitle text-center font-sans">홈으로</Text>
            </Pressable>
            <Pressable
              className={`w-[71px] bg-primary-500 rounded-3xl items-center justify-center px-2.5 py-[15px] ${isSharing ? 'opacity-60' : ''}`}
              disabled={isSharing}
              onPress={shareAsImage}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="#FAFAFA" />
              ) : (
                <ShareIcon width={24} height={24} color="#FAFAFA" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
