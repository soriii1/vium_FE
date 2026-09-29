import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Button } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';
import PhotoIcon from '@/../assets/icons/photo-icon.svg';
import { NICKNAME_MAX_LENGTH, useProfileEdit } from '../lib/useProfileEdit';

export const ProfileEditPage: React.FC = () => {
  const router = useRouter();
  const {
    nickname,
    setNickname,
    clearNickname,
    profileImageUrl,
    handle,
    pickImage,
    canSave,
    save,
  } = useProfileEdit();

  const handleSave = () => {
    if (save()) router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-4 self-start">
            <BackIcon width={30} height={30} color="#000000" />
            <Text className="text-title font-medium font-sans text-black">프로필 수정</Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center px-5 pt-[55px]">
          <View className="w-full max-w-[271px] items-center gap-[42px]">
            {/* 프로필 이미지 */}
            <View className="w-[117px] h-[117px]">
              <View className="w-full h-full rounded-full border-[3px] border-secondary-400 overflow-hidden bg-neutral-50">
                {profileImageUrl && (
                  <Image source={{ uri: profileImageUrl }} contentFit="cover" className="w-full h-full" />
                )}
              </View>
              <Pressable
                onPress={pickImage}
                className="absolute bottom-0 right-0 w-9 h-9"
              >
                <PhotoIcon width={36} height={36} />
              </Pressable>
            </View>

            {/* 닉네임 */}
            <View className="w-full gap-2">
              <Text className="text-text14 font-sans text-text-300">닉네임</Text>
              <View className="flex-row items-center justify-between">
                <TextInput
                  className="flex-1 text-subtitle font-sans text-text-100"
                  style={{ fontFamily: 'Paperlogy' }}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="닉네임을 입력하세요"
                  placeholderTextColor="#A7A9B5"
                  maxLength={NICKNAME_MAX_LENGTH}
                />
                {nickname.length > 0 && (
                  <Pressable onPress={clearNickname} className="w-6 h-6 items-center justify-center">
                    <Text className="text-[18px] font-sans text-text-100">✕</Text>
                  </Pressable>
                )}
              </View>
              <View className="h-[2px] bg-neutral-100 rounded-full" />
              <Text className="text-text14 font-sans text-text-300 text-right">
                {nickname.length}/{NICKNAME_MAX_LENGTH}자
              </Text>
            </View>

            {/* 아이디 (수정 불가) */}
            <View className="w-full gap-2">
              <Text className="text-text14 font-sans text-text-300">아이디</Text>
              <Text className="text-subtitle font-sans text-neutral-200">@{handle}</Text>
              <View className="h-[2px] bg-neutral-50 rounded-full" />
            </View>
          </View>
        </View>

        <View className="w-full items-center pt-10 pb-[60px] px-5">
          <Button onPress={handleSave} disabled={!canSave}>
            저장
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
