import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ChevronLeftIcon from '@/../assets/icons/chevron-left-icon.svg';
import { RecipeCategory } from '../types';
import { useRecipesList } from '../lib/useRecipesList';
import { RecipeCategoryFilter } from '../ui/RecipeCategoryFilter';
import { RecipeListCard } from '../ui/RecipeListCard';

export const RecipePage: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState<RecipeCategory>('전체');
  const { recipes, isLoading, error } = useRecipesList(category);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
        <View className="bg-neutral-50 h-7 w-[79px] items-center justify-center">
          <Text className="text-text14 text-neutral-300 font-medium font-sans">Logo</Text>
        </View>
      </View>

      <View className="px-5 md:px-10 lg:px-20 pt-[26px] gap-[26px]">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/main'))}
          className="flex-row items-center gap-4 self-start"
        >
          <ChevronLeftIcon width={30} height={30} color="#242529" />
          <Text className="text-title font-medium font-sans text-text-100">맞춤 레시피</Text>
        </Pressable>

        <RecipeCategoryFilter selected={category} onSelect={setCategory} />
      </View>

      <View className="px-5 md:px-10 lg:px-20 pt-[52px]">
        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#A2CD87" />
          </View>
        ) : error ? (
          <Text className="text-text14 text-text-200 font-sans text-center py-10">{error}</Text>
        ) : recipes.length === 0 ? (
          <Text className="text-text14 text-text-200 font-sans text-center py-10">
            추천할 수 있는 레시피가 없어요.
          </Text>
        ) : (
          <View className="gap-[26px]">
            {recipes.map((recipe) => (
              <RecipeListCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}` as any)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
