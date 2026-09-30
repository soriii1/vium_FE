import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageUpload, LabelInput, LabelInputWithUnit, DatePicker, Button } from '@/shared/ui';
import { useIngredientRegister } from '../lib/useIngredientRegister';
import { StorageMethodSelect, STORAGE_METHOD_OPTIONS } from '../ui/StorageMethodSelect';
import * as ImagePicker from 'expo-image-picker';
import BackIcon from '@/../assets/icons/back-icon.svg';

export const FridgeAddPage: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useIngredientRegister();
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unitId, setUnitId] = useState(0);
  const [unitLabel, setUnitLabel] = useState('');
  const [storageMethodId, setStorageMethodId] = useState<number>(STORAGE_METHOD_OPTIONS[0].id);
  const [price, setPrice] = useState('');
  const [registeredDate, setRegisteredDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUnitChange = (id: number, label: string) => {
    setUnitId(id);
    setUnitLabel(label);
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async () => {
    const success = await register({
      name,
      amount,
      unitId,
      storageMethodId,
      price,
      registeredDate: formatDateToString(registeredDate),
      expiryDate: formatDateToString(expiryDate),
      imageUri,
    });

    if (success) {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="pt-20 px-7 gap-3">
          <View className="bg-neutral-50 h-[28px] w-[79px] items-center justify-center">
            <Text className="text-text14 text-neutral-300 font-medium font-sans">
              Logo
            </Text>
          </View>
        </View>

        <View className="px-7 gap-10 pt-10">
          <Pressable onPress={() => router.back()}>
            <BackIcon width={30} height={30} />
          </Pressable>

          <View className="gap-6 w-full max-w-[346px]">
            <ImageUpload imageUri={imageUri} onPress={handleImagePick} />

            <View className="gap-[5px] flex-row items-center">
              <TextInput
                className="text-title font-medium font-sans flex-1"
                style={{ fontFamily: 'Paperlogy' }}
                value={name}
                onChangeText={setName}
                placeholder="입력해주세요"
                placeholderTextColor="#878787"
              />
            </View>

            <View className="gap-4">
              <LabelInputWithUnit
                label="양"
                value={amount}
                onChangeText={setAmount}
                unitId={unitId}
                onUnitChange={handleUnitChange}
                placeholder="입력하세요"
              />
              <LabelInput
                label="가격"
                value={price}
                onChangeText={setPrice}
                placeholder="입력하세요"
                keyboardType="numeric"
              />
              <StorageMethodSelect label="보관방법" value={storageMethodId} onChange={setStorageMethodId} />
              <DatePicker
                label="등록일자"
                value={registeredDate}
                onChange={setRegisteredDate}
              />
              <DatePicker
                label="소비기한"
                value={expiryDate}
                onChange={setExpiryDate}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 이 화면은 하단 탭이 없어서 기기 하단 안전 영역만큼만 띄움 */}
      <View className="px-12 pt-4 items-center" style={{ paddingBottom: Math.max(insets.bottom, 16) + 24 }}>
        {isLoading ? (
          <View className="bg-neutral-500 h-[68px] w-[299px] rounded-3xl items-center justify-center">
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <Pressable
            className="bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px]"
            onPress={handleRegister}
          >
            <Text className="text-text-400 text-subtitle text-center font-sans">
              등록하기
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
