import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Modal, Pressable, ScrollView } from 'react-native';

interface UnitOption {
  id: number;
  label: string;
}

interface LabelInputWithUnitProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  unitId: number;
  onUnitChange: (unitId: number, unitLabel: string) => void;
  style?: any;
}

const UNIT_OPTIONS: UnitOption[] = [
  { id: 1, label: '개' },
  { id: 2, label: 'g' },
  { id: 3, label: 'kg' },
  { id: 4, label: 'ml' },
  { id: 5, label: 'L' },
  { id: 6, label: '팩' },
  { id: 7, label: '봉' },
  { id: 8, label: '병' },
  { id: 9, label: '캔' },
  { id: 10, label: '통' },
];

export const LabelInputWithUnit: React.FC<LabelInputWithUnitProps> = ({
  label,
  value,
  onChangeText,
  unitId,
  onUnitChange,
  placeholder = '입력하세요',
  style,
  ...props
}) => {
  const [showUnitModal, setShowUnitModal] = useState(false);

  const handleUnitSelect = (option: UnitOption) => {
    onUnitChange(option.id, option.label);
    setShowUnitModal(false);
  };

  const selectedUnit = UNIT_OPTIONS.find(opt => opt.id === unitId);

  return (
    <>
      <View className="flex-row items-center justify-between" style={style}>
        <Text className="text-text16 text-neutral-200 font-medium font-sans">
          {label}
        </Text>
        <View className="flex-row gap-2 items-center">
          <View className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[139px] justify-center">
            <TextInput
              className="text-text15 font-sans"
              style={{ color: value ? '#242529' : '#767676', fontFamily: 'Paperlogy' }}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#767676"
              keyboardType="numeric"
              {...props}
            />
          </View>
          <Pressable
            className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[50px] justify-center items-center"
            onPress={() => setShowUnitModal(true)}
          >
            <Text className="text-text15 font-sans" style={{ color: selectedUnit ? '#242529' : '#767676' }}>
              {selectedUnit?.label || '단위'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={showUnitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnitModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowUnitModal(false)}
        >
          <Pressable className="bg-white rounded-2xl w-[280px] max-h-[400px]" onPress={(e) => e.stopPropagation()}>
            <View className="py-4 border-b border-neutral-100">
              <Text className="text-subtitle font-normal text-center font-sans">
                단위 선택
              </Text>
            </View>
            <ScrollView className="max-h-[300px]">
              {UNIT_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  className="py-4 px-6 border-b border-neutral-50"
                  onPress={() => handleUnitSelect(option)}
                >
                  <Text
                    className="text-text15 font-sans text-center"
                    style={{ color: unitId === option.id ? '#242529' : '#767676' }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
