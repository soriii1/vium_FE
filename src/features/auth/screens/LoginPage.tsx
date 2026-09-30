import { useLogin } from "../lib/useLogin";
import { Button } from "@/shared/ui/Button";
import { InputBox } from "@/shared/ui/InputBox";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SocialLoginButtons } from "../ui/SocialLoginButtons";
import { AppHeader } from '@/shared/ui';

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();

  const handleLogin = async () => {
    const user = await login(email, password);
    if (!user) return;

    router.replace("/main");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-screen md:px-10 lg:px-20 pt-[161px] items-center">
        <View className="absolute top-0 left-0 right-0">
          <AppHeader />
        </View>
        <View className="w-full max-w-[480px]">
          <View className="mb-[89px]">
            <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[74px] font-sans">
              비움에 오신걸 환영해요!{"\n"}함께 시작해요
            </Text>

            <View>
              <Text className="text-text16 md:text-[18px] font-medium text-text-100 mb-[14px] font-sans">
                메일 로그인
              </Text>
              <View className="gap-4">
                <InputBox
                  type="email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일 입력"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                />
                <InputBox
                  type="password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호 입력"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                />
              </View>
            </View>
          </View>

          <View className="items-center">
            {/* TODO: 소셜 로그인 연동 */}
            <SocialLoginButtons label="SNS 계정으로 로그인" />
          </View>
        </View>
      </View>

      <View className="w-full items-center pb-[100px]">
        <View className="flex-row items-center mb-2">
          <Text className="text-text14 md:text-text15 text-text-300 font-sans">
            혹시 계정이 없나요?{" "}
          </Text>
          <Pressable onPress={() => router.push("/signUp")} hitSlop={8}>
            <Text className="text-text14 md:text-text15 text-text-100 font-medium font-sans">
              회원가입하기
            </Text>
          </Pressable>
        </View>

        <Button onPress={handleLogin} disabled={isLoading}>
          로그인
        </Button>
      </View>
    </View>
  );
};
