import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StateBall } from './StateBall';

interface CardProps {
  variant?: 'default' | 'empty';
  title?: string;
  subtitle?: string;
  image?: any;
  status?: '위험' | '보통' | '양호';
  visible?: boolean;
  onPress?: () => void;
  style?: any;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  title,
  subtitle,
  image,
  status,
  visible = true,
  onPress,
  style,
}) => {
  if (variant === 'empty') {
    return (
      <Pressable onPress={onPress}>
        <View
          className="w-full aspect-[111/140] bg-white rounded-lg border-2 border-dashed border-neutral-100 items-center justify-center"
          style={style}
        >
          <Text className="text-neutral-300 text-[40px] md:text-[48px] font-sans">+</Text>
        </View>
      </Pressable>
    );
  }

  const content = (
    <View className="w-full aspect-[111/140] bg-white rounded-lg border-2 border-neutral-400" style={style}>
      <View className="flex-1 flex-col">
        <View className="p-2">
          <View className="w-full aspect-[20/15] bg-neutral-10 rounded items-center justify-center">
            {image ? (
              <Image source={image} contentFit="cover" className="w-full h-full rounded" />
            ) : (
              <View className="w-full h-full bg-neutral-10 rounded" />
            )}
          </View>

          <View className="flex-row items-start justify-between gap-1 mt-1">
            <Text
              className="text-text-100 text-text14 md:text-text15 font-medium font-sans flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            {visible && status && (
              <View className="mt-0.5">
                <StateBall state={status} />
              </View>
            )}
          </View>
        </View>

        <View className="flex-1" />

        <View className="px-2 pb-2">
          <Text
            className="text-text-200 text-[12px] md:text-[13px] font-sans"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};
