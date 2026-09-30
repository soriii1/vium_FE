import React from 'react';
import { Pressable, Text, View } from 'react-native';

// 백엔드 storage_methods 시드 순서 (V2__seed_code_tables.sql)
export const STORAGE_METHOD_OPTIONS = [
  { id: 1, label: '냉장' },
  { id: 2, label: '냉동' },
  { id: 3, label: '실온' },
] as const;

interface StorageMethodSelectProps {
  label: string;
  value: number;
  onChange: (storageMethodId: number) => void;
}

export const StorageMethodSelect: React.FC<StorageMethodSelectProps> = ({ label, value, onChange }) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-text16 text-neutral-200 font-medium font-sans">{label}</Text>
      <View className="flex-row gap-2 w-[199px]">
        {STORAGE_METHOD_OPTIONS.map((option) => {
          const isSelected = option.id === value;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              className={`flex-1 h-[27px] rounded-lg items-center justify-center ${
                isSelected ? 'bg-primary-400 border border-primary-200' : 'bg-neutral-50'
              }`}
            >
              <Text className={`text-text15 font-sans ${isSelected ? 'text-text-100' : 'text-neutral-300'}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
