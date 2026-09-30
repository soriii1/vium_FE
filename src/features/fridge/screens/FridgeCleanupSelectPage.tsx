import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useIngredientsList } from '../lib/useIngredientsList';
import { fridgeCleanupStore } from '../lib/fridgeCleanupStore';
import { AppHeader } from '@/shared/ui';

export const FridgeCleanupSelectPage: React.FC = () => {
  const router = useRouter();
  const { items, isLoading, error } = useIngredientsList();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNext = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    fridgeCleanupStore.setSelectedItems(selectedItems);
    router.push('/fridge/cleanup/amount' as any);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AppHeader />

        <View className="flex-1 px-screen md:px-10 lg:px-20 pt-[64px] items-center">
          <View className="w-full max-w-[480px] gap-12">
            <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 font-sans">
              다 먹었거나 폐기할{'\n'}재료를 선택해 주세요
            </Text>

            {isLoading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color="#A2CD87" />
              </View>
            ) : error ? (
              <Text className="text-text14 text-text-200 font-sans text-center py-10">
                {error}
              </Text>
            ) : items.length === 0 ? (
              <Text className="text-text14 text-text-200 font-sans text-center py-10">
                등록된 재료가 없습니다.
              </Text>
            ) : (
              <View className="gap-6">
                {items.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => toggleSelect(item.id)}
                      className={`rounded-lg px-5 py-2.5 border-2 ${
                        isSelected
                          ? 'bg-primary-200 border-primary-600'
                          : 'bg-white border-neutral-100'
                      }`}
                    >
                      <Text className="text-[20px] font-sans text-black">
                        {item.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-12 pb-[100px] items-center">
        <Pressable
          className={`bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px] ${
            selectedIds.size === 0 ? 'opacity-50' : ''
          }`}
          onPress={handleNext}
          disabled={selectedIds.size === 0}
        >
          <Text className="text-text-400 text-subtitle text-center font-sans">
            다음
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
