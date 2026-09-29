import React from 'react';
import { View } from 'react-native';
import { RecipePage as RecipePageFeature } from '@/features/recipe';

export const RecipePage: React.FC = () => {

  return (
    <View className="flex-1 bg-white">
      <RecipePageFeature />
    </View>
  );
};
