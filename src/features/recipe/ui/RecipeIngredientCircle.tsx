import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import PlusBadgeIcon from '@/../assets/icons/plus-badge-icon.svg';

interface RecipeIngredientCircleProps {
  name: string;
  image?: string;
  onPress?: () => void;
  isAddButton?: boolean;
}

export const RecipeIngredientCircle: React.FC<RecipeIngredientCircleProps> = ({
  name,
  image,
  onPress,
  isAddButton = false,
}) => {
  const content = (
    <View className="items-center justify-center gap-3 w-[66px]">
      {isAddButton ? (
        <View className="w-[38px] h-[38px]">
          <Image
            source={require('@/../assets/images/dashed-circle.png')}
            contentFit="contain"
            style={{ width: 38, height: 38 }}
          />
          <View className="absolute top-[2px] -right-[3px]">
            <PlusBadgeIcon width={13} height={13} />
          </View>
        </View>
      ) : (
        <View className="w-[38px] h-[38px] rounded-full bg-neutral-50 items-center justify-center overflow-hidden">
          {image && <Image source={{ uri: image }} contentFit="contain" style={{ width: 30, height: 30 }} />}
        </View>
      )}
      <Text
        className="text-[12px] font-sans text-black text-center"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};
