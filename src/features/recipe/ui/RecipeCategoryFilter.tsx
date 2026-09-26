import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { RecipeCategory } from '../types';

const CATEGORIES: RecipeCategory[] = ['전체', '한식', '양식', '일식', '디저트'];

interface RecipeCategoryFilterProps {
  selected: RecipeCategory;
  onSelect: (category: RecipeCategory) => void;
}

export const RecipeCategoryFilter: React.FC<RecipeCategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {CATEGORIES.map((category) => {
        const isActive = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            className={`h-8 min-w-[55px] px-3 items-center justify-center rounded-2xl border-[3px] ${
              isActive ? 'bg-primary-500 border-primary-300' : 'bg-neutral-50 border-neutral-50'
            }`}
          >
            <Text className="text-text14 font-sans text-text-50">{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
