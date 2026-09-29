import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Banner } from '@/shared/ui';
import { useFridgeCleanup, FridgeCleanupModal } from '@/features/fridge-cleanup';
import ReportIcon from '@/../assets/icons/report-icon.svg';
import CartIcon from '@/../assets/icons/cart-icon.svg';
import BrushIcon from '@/../assets/icons/brush-icon.svg';
import RefrigeratorIcon from '@/../assets/icons/refrigerator-icon.svg';
import ChefIcon from '@/../assets/icons/chef-icon.svg';
import BellIcon from '@/../assets/icons/bell-icon.svg';
import ChevronRightIcon from '@/../assets/icons/chevron-right-icon.svg';

export const MainPage = () => {
  const router = useRouter();
  const { isCleanupModalVisible, openCleanupModal, closeCleanupModal } = useFridgeCleanup();

  const handleBannerPress = (variant: 'tomato' | 'potato' | 'onion') => {
    if (variant === 'tomato') router.push('/recipe' as any);
    if (variant === 'potato') router.push('/report' as any);
    // TODO: 장보기 페이지가 생기면 onion 배너 연결
  };

  const menuItems = [
    { icon: ReportIcon, label: '식재료 리포트', onPress: () => router.push('/report' as any) },
    { icon: CartIcon, label: '장보기 도우미', onPress: () => console.log('장보기 도우미') },
    { icon: BrushIcon, label: '냉장고 대청소', onPress: openCleanupModal },
    { icon: RefrigeratorIcon, label: 'My 냉장고', onPress: () => router.push('/fridge') },
    { icon: ChefIcon, label: '레시피', onPress: () => router.push('/recipe') },
  ];

  const recipes = [
    { id: 1, title: '당근김치찌개', ingredients: ['당근', '감자'], cookTimeMinutes: 20 },
    { id: 2, title: '감자조림', ingredients: ['감자', '양파'], cookTimeMinutes: 25 },
  ];
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View className="px-7 pt-[74px] pb-9 flex-row items-center justify-between max-w-[1200px] w-full mx-auto">
          <View className="bg-neutral-50 h-7 w-[79px] items-center justify-center">
            <Text className="text-text14 text-neutral-300 font-medium font-sans">Logo</Text>
          </View>
          {/* TODO: 알림 페이지 연결 */}
          <Pressable className="w-[35px] h-[35px]">
            <BellIcon width={35} height={35} />
          </Pressable>
        </View>

        <View className="px-5 md:px-10 lg:px-20 max-w-[1200px] w-full mx-auto gap-[50px]">
          <View className="items-center gap-[53px]">
            <Banner onPress={handleBannerPress} />

            {/* Menu Grid */}
            <View className="w-full items-center gap-10">
              <View className="w-full flex-row flex-wrap gap-y-8">
                {menuItems.map((item) => (
                  <Pressable
                    key={item.label}
                    className="w-1/3 items-center gap-3"
                    onPress={item.onPress}
                  >
                    <item.icon width={44} height={44} />
                    <Text className="text-text14 font-sans text-text-100 text-center">
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View className="w-full h-px bg-neutral-100" />
            </View>
          </View>

          {/* Recipe Section */}
          <View className="gap-4">
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => router.push('/recipe')}
            >
              <Text className="text-[18px] font-medium font-sans text-neutral-800">
                오늘의 냉털 레시피
              </Text>
              <ChevronRightIcon width={9.3} height={14.8} color="#000000" />
            </Pressable>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {recipes.map((recipe) => (
                <Pressable
                  key={recipe.id}
                  className="bg-white rounded-lg border border-neutral-100 p-4 w-[240px] h-[140px] justify-between"
                  onPress={() => router.push(`/recipe/${recipe.id}` as any)}
                >
                  <Text numberOfLines={1} className="text-[18px] font-semibold font-sans text-primary-800">
                    {recipe.title}
                  </Text>
                  <View className="gap-[7px]">
                    <Text className="text-text14 font-sans text-text-200">
                      조리시간{' '}
                      <Text className="text-text15 font-medium font-sans text-neutral-500">
                        {recipe.cookTimeMinutes}분
                      </Text>
                    </Text>
                    <Text numberOfLines={1} className="text-[13px] font-sans text-neutral-400">
                      {recipe.ingredients.map((ingredient) => `#${ingredient}`).join(' ')}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>


      <FridgeCleanupModal
        visible={isCleanupModalVisible}
        onClose={closeCleanupModal}
        onConfirm={() => {
          closeCleanupModal();
          router.push('/fridge/cleanup/select' as any);
        }}
      />
    </View>
  );
};
