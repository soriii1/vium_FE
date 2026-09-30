import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ChevronLeftIcon from '@/../assets/icons/chevron-left-icon.svg';
import { RecipeCategory } from '../types';
import { useRecipesList } from '../lib/useRecipesList';
import { RecipeCategoryFilter } from '../ui/RecipeCategoryFilter';
import { RecipeListCard } from '../ui/RecipeListCard';
import { AppHeader } from '@/shared/ui';

export const RecipePage: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState<RecipeCategory>('전체');
  const { recipes, isLoading, error, needsCatalogIngredients, refresh } = useRecipesList(category);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader />

      <View className="px-screen md:px-10 lg:px-20 pt-[26px] gap-[26px]">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/main'))}
          className="flex-row items-center gap-4 self-start"
        >
          <ChevronLeftIcon width={30} height={30} color="#242529" />
          <Text className="text-title font-medium font-sans text-text-100">맞춤 레시피</Text>
        </Pressable>

        <RecipeCategoryFilter selected={category} onSelect={setCategory} />
      </View>

      <View className="px-screen md:px-10 lg:px-20 pt-[52px]">
        {isLoading ? (
          <View className="items-center py-10 gap-4">
            <ActivityIndicator size="large" color="#A2CD87" />
            {/* 처음 추천받을 때는 AI가 레시피를 만들어 몇 초 걸릴 수 있음 */}
            <Text className="text-text14 text-text-200 font-sans">냉장고 재료로 레시피를 찾고 있어요</Text>
          </View>
        ) : needsCatalogIngredients ? (
          <View className="items-center py-10 gap-4">
            <Text className="text-text14 text-text-200 font-sans text-center">
              레시피를 추천하려면 재료를 등록할 때{'\n'}목록에서 재료를 골라주세요.
            </Text>
            <Pressable onPress={() => router.push('/fridge/add' as any)} hitSlop={8}>
              <Text className="text-text14 font-medium font-sans text-text-100">재료 등록하러 가기</Text>
            </Pressable>
          </View>
        ) : error ? (
          <View className="items-center py-10 gap-4">
            <Text className="text-text14 text-text-200 font-sans text-center">{error}</Text>
            <Pressable onPress={refresh} hitSlop={8}>
              <Text className="text-text14 font-medium font-sans text-text-100">다시 시도</Text>
            </Pressable>
          </View>
        ) : recipes.length === 0 ? (
          <Text className="text-text14 text-text-200 font-sans text-center py-10">
            추천할 수 있는 레시피가 없어요.{'\n'}냉장고에 재료를 등록하면 레시피를 추천해 드려요.
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
