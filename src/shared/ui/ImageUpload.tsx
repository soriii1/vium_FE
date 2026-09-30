import React from 'react';
import { Pressable, View, Image } from 'react-native';
import PhotoIcon from '@/../assets/icons/photo-icon.svg';

interface ImageUploadProps {
  imageUri?: string;
  onPress?: () => void;
  style?: any;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUri,
  onPress,
  style,
}) => {
  return (
    <View className="relative w-full h-[241px] rounded-lg" style={style}>
      <Pressable onPress={onPress} className="w-full h-full rounded-lg overflow-hidden bg-neutral-50">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-neutral-50" />
        )}
      </Pressable>

      <Pressable
        onPress={onPress}
        className="absolute right-3 bottom-3 w-[34px] h-[34px]"
      >
        <PhotoIcon width={34} height={34} />
      </Pressable>
    </View>
  );
};
