import React from 'react';
import { View, Text, Pressable } from 'react-native';
import BackIcon from '@/../assets/icons/back-icon.svg';

interface FridgeHeaderProps {
  title: string;
  onBackPress: () => void;
  onManagePress: () => void;
}

export const FridgeHeader: React.FC<FridgeHeaderProps> = ({
  title,
  onBackPress,
  onManagePress,
}) => {
  return (
    <View className="px-4 md:px-8 lg:px-16 pt-16 pb-4 mt-[40px] max-w-[1200px] mx-auto w-full">
      {/* Back Button and Title */}
      <View className="flex-row items-center mb-2">
        <Pressable onPress={onBackPress} className="mr-2 md:mr-4">
          <BackIcon width={24} height={24} color="#333333" />
        </Pressable>
        <Text className="text-text-100 text-title md:text-[28px] lg:text-[32px] font-medium font-sans">
          {title}
        </Text>
      </View>

      {/* Manage Button */}
      <View className="items-end">
        <Pressable onPress={onManagePress} className="py-2 px-4">
          <Text className="text-text-200 text-text14 md:text-text15 font-sans">관리하기 {'>'}</Text>
        </Pressable>
      </View>
    </View>
  );
};
