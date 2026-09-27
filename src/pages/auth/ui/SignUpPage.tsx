import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { InputBox } from '@/shared/ui/InputBox';
import { router } from 'expo-router';
import { SocialLoginButtons } from './SocialLoginButtons';

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignUp = () => {
    // TODO: Implement signup logic
    router.push('/profile');
  };

  const handleCheckDuplicate = () => {
    // TODO: Implement duplicate check logic
    console.log('Check duplicate for:', email);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-5 md:px-10 lg:px-20 pt-[161px] items-center">
        <View className="w-full max-w-[480px]">
          <View className="mb-[35px]">
            <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[67px] font-sans">
              어서오세요,{'\n'}비움이 처음이신가요?
            </Text>

            <View>
              <Text className="text-text16 md:text-[18px] font-medium text-text-100 mb-[14px] font-sans">
                회원가입
              </Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <InputBox
                    type="email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="이메일 입력"
                    style={{ flex: 1 }}
                  />
                  <Pressable
                    onPress={handleCheckDuplicate}
                    className="w-[72px] py-1.5 bg-primary-400 border-2 border-primary-200 rounded-lg items-center justify-center"
                  >
                    <Text className="text-text14 text-text-100 font-sans">중복 확인</Text>
                  </Pressable>
                </View>
                <InputBox
                  type="password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호 입력"
                />
                <InputBox
                  type="password"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  placeholder="비밀번호 재입력"
                />
              </View>
            </View>
          </View>

          <View className="items-center">
            {/* TODO: 소셜 회원가입 연동 */}
            <SocialLoginButtons label="SNS 계정으로 빠른 회원가입" />
          </View>
        </View>
      </View>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleSignUp}>
          회원가입
        </Button>
      </View>
    </View>
  );
};
