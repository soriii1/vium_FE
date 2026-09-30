import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  style?: any;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  style,
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShow(false);
  };

  const formatDate = (date: Date, separator = '/'): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return [year, month, day].join(separator);
  };

  // <input type="date">의 값(YYYY-MM-DD)을 로컬 날짜로 변환 (new Date(문자열)은 UTC 기준이라 하루 밀릴 수 있음)
  const handleWebChange = (inputValue: string) => {
    if (!inputValue) return;
    const [year, month, day] = inputValue.split('-').map(Number);
    onChange(new Date(year, month - 1, day));
  };

  return (
    <View className="flex-row items-center justify-between" style={style}>
      <Text className="text-text16 text-neutral-200 font-medium font-sans">
        {label}
      </Text>
      <Pressable
        className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[199px] justify-center"
        onPress={() => setShow(true)}
      >
        <Text className="text-text15 font-sans" style={{ color: '#242529' }}>
          {formatDate(value)}
        </Text>

        {/* 웹은 DateTimePicker가 없어 브라우저 기본 날짜 선택창을 투명하게 덮어 사용 */}
        {Platform.OS === 'web' && (
          <input
            type="date"
            value={formatDate(value, '-')}
            min="2020-01-01"
            max="2030-12-31"
            onChange={(e) => handleWebChange(e.target.value)}
            // 데스크톱 크롬은 입력칸을 눌러도 달력이 안 열려 직접 열어줌
            onClick={(e) => e.currentTarget.showPicker?.()}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
        )}
      </Pressable>

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date(2030, 11, 31)}
          minimumDate={new Date(2020, 0, 1)}
        />
      )}

      {show && Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={handleCancel}
          >
            <Pressable
              className="bg-white rounded-t-3xl items-center"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center px-4 py-3 border-b border-neutral-100 w-full">
                <Pressable onPress={handleCancel}>
                  <Text className="text-text16 text-neutral-400 font-sans">
                    취소
                  </Text>
                </Pressable>
                <Text className="text-subtitle font-normal text-text-100 font-sans">
                  날짜 선택
                </Text>
                <Pressable onPress={handleConfirm}>
                  <Text className="text-text16 text-neutral-500 font-normal font-sans">
                    확인
                  </Text>
                </Pressable>
              </View>

              <View className="py-4 items-center w-full">
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                  maximumDate={new Date(2030, 11, 31)}
                  minimumDate={new Date(2020, 0, 1)}
                  locale="ko-KR"
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
