import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import ChevronLeftIcon from '@/../assets/icons/chevron-left-icon.svg';
import { formatYear, formatYearMonth } from '../lib/formatters';
import {
  FIRST_REPORT_YEAR,
  MONTHS,
  YearMonth,
  getCurrentYearMonth,
  isFutureMonth,
} from '../lib/reportMonths';

interface ReportMonthPickerProps {
  value: YearMonth;
  onChange: (value: YearMonth) => void;
}

export const ReportMonthPicker: React.FC<ReportMonthPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  // 시트 안에서 넘겨보는 연도 (월을 고르기 전까지는 선택값을 바꾸지 않음)
  const [viewYear, setViewYear] = useState(value.year);

  const currentYear = getCurrentYearMonth().year;
  const canGoPrev = viewYear > FIRST_REPORT_YEAR;
  const canGoNext = viewYear < currentYear;

  const open = () => {
    setViewYear(value.year);
    setIsOpen(true);
  };

  const handleSelect = (month: number) => {
    onChange({ year: viewYear, month });
    setIsOpen(false);
  };

  return (
    <>
      <Pressable className="flex-row items-center gap-[7px]" onPress={open}>
        <Text className="text-subtitle font-medium font-sans text-text-100">
          {formatYearMonth(value.year, value.month)}
        </Text>
        <View style={{ transform: [{ rotate: '-90deg' }] }}>
          <ChevronLeftIcon width={18} height={18} color="#242529" />
        </View>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setIsOpen(false)}>
          <Pressable
            className="bg-white rounded-t-3xl px-6 pt-3 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="self-center w-10 h-1 rounded-full bg-neutral-50 mb-6" />

            <View className="flex-row items-center justify-between mb-6">
              <Pressable
                className="w-10 h-10 rounded-full items-center justify-center active:bg-neutral-10"
                disabled={!canGoPrev}
                onPress={() => setViewYear((y) => y - 1)}
              >
                <ChevronLeftIcon width={18} height={18} color={canGoPrev ? '#242529' : '#C0C0C0'} />
              </Pressable>
              <Text className="text-subtitle font-sans text-text-100">
                {formatYear(viewYear)}
              </Text>
              <Pressable
                className="w-10 h-10 rounded-full items-center justify-center active:bg-neutral-10"
                disabled={!canGoNext}
                onPress={() => setViewYear((y) => y + 1)}
              >
                <View style={{ transform: [{ rotate: '180deg' }] }}>
                  <ChevronLeftIcon width={18} height={18} color={canGoNext ? '#242529' : '#C0C0C0'} />
                </View>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap -m-1">
              {MONTHS.map((month) => {
                const isSelected = viewYear === value.year && month === value.month;
                const isDisabled = isFutureMonth(viewYear, month);
                return (
                  <View key={month} className="w-1/4 p-1">
                    <Pressable
                      className={`py-3 rounded-full items-center ${
                        isSelected ? 'bg-primary-200' : isDisabled ? '' : 'active:bg-primary-100'
                      }`}
                      disabled={isDisabled}
                      onPress={() => handleSelect(month)}
                    >
                      <Text
                        className={`text-text15 font-sans ${
                          isSelected
                            ? 'text-text-100'
                            : isDisabled
                              ? 'text-neutral-100'
                              : 'text-text-100'
                        }`}
                      >
                        {month}월
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
