import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackIcon from '@/../assets/icons/back-icon.svg';
import { useRecipeDetail } from '../lib/useRecipeDetail';
import { recipeCookStore } from '../lib/recipeCookStore';
import { RecipeIngredientCircle } from '../ui/RecipeIngredientCircle';
import { RecipeStepCard } from '../ui/RecipeStepCard';
import { Logo } from '@/shared/ui';

export const RecipeDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);
  const { recipe, isLoading, error } = useRecipeDetail(recipeId);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#A2CD87" />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-5">
        <Text className="text-text14 font-sans text-text-200 text-center">
          {error || '레시피를 찾을 수 없습니다.'}
        </Text>
      </View>
    );
  }

  const handleFinishCooking = () => {
    recipeCookStore.startCookCompletion(recipe.id, recipe.ingredients);
    router.push(`/recipe/${recipe.id}/waste` as any);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
          <Logo />
        </View>

        <View className="px-5 md:px-10 lg:px-20 pt-[47px] items-center">
          <View className="w-full max-w-[480px] gap-[69px]">
            <View className="gap-[25px]">
              <View className="gap-8">
                <Pressable
                  onPress={() => router.back()}
                  className="flex-row items-center gap-4"
                >
                  <BackIcon width={30} height={30} color="#000000" />
                  <Text className="text-title font-medium font-sans text-black">{recipe.title}</Text>
                </Pressable>

                <View className="w-full h-[241px] rounded-lg bg-neutral-50 overflow-hidden">
                  {recipe.image && (
                    <Image source={{ uri: recipe.image }} contentFit="cover" className="w-full h-full" />
                  )}
                </View>
              </View>

              <View className="gap-16">
                <View className="gap-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-text16 font-medium font-sans text-neutral-200">조리시간</Text>
                    <Text className="text-text15 font-sans text-black">{recipe.cookTimeMinutes}분</Text>
                  </View>

                  <View className="gap-[25px]">
                    <Text className="text-text16 font-medium font-sans text-neutral-200">사용재료</Text>
                    <View className="flex-row flex-wrap gap-x-6 gap-y-[14px]">
                      {recipe.ingredients.map((ingredient, index) => (
                        <RecipeIngredientCircle key={`${ingredient.id}-${index}`} name={ingredient.name} />
                      ))}
                      <RecipeIngredientCircle
                        name="추가"
                        isAddButton
                        onPress={() => router.push(`/recipe/${recipe.id}/add` as any)}
                      />
                    </View>
                  </View>
                </View>

                <View className="h-px bg-neutral-100 w-full" />
              </View>
            </View>

            <View className="gap-8">
              <Text className="text-subtitle font-medium font-sans text-neutral-600">
                조리방법을 알려드릴게요!
              </Text>
              <View className="gap-[19px]">
                {recipe.steps.map((step) => (
                  <RecipeStepCard key={step.step} step={step} />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-12 pb-[60px] items-center">
        <Pressable
          className="bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px]"
          onPress={handleFinishCooking}
        >
          <Text className="text-text-400 text-subtitle text-center font-sans">다 만들었어요!</Text>
        </Pressable>
      </View>
    </View>
  );
};
