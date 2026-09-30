import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { IngredientCatalogItem } from '../types';

const MAX_VISIBLE = 5;

interface CatalogSuggestionsProps {
  items: IngredientCatalogItem[];
  isLoading: boolean;
  onSelect: (item: IngredientCatalogItem) => void;
}

export const CatalogSuggestions: React.FC<CatalogSuggestionsProps> = ({ items, isLoading, onSelect }) => {
  if (isLoading && items.length === 0) {
    return (
      <View className="py-3 items-center">
        <ActivityIndicator size="small" color="#A1A1A1" />
      </View>
    );
  }

  if (items.length === 0) return null;

  return (
    <View className="border border-neutral-50 rounded-lg overflow-hidden">
      {items.slice(0, MAX_VISIBLE).map((item, index) => (
        <Pressable
          key={item.ingredientCatalogId}
          onPress={() => onSelect(item)}
          className={`px-3 py-2.5 bg-white active:bg-neutral-10 ${index > 0 ? 'border-t border-neutral-50' : ''}`}
        >
          <Text className="text-text15 font-sans text-text-100">{item.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};
