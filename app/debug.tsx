import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Check, StateBall, Banner, InputBox, Button, AddButton, NavBar, Card } from '@/shared/ui';

export default function DebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailWithCheck, setEmailWithCheck] = useState('25_57@bssm.hs.kr');
  const [passwordWithCheck, setPasswordWithCheck] = useState('password123');

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-title font-bold mt-6 mb-4 text-text-100 font-sans">
          Component Debug Page
        </Text>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            NavBar Component
          </Text>
          <NavBar />
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            Check Component
          </Text>
          <View className="flex-row" style={{ gap: 16 }}>
            <View className="items-center">
              <Check variant="true" />
              <Text className="text-text14 mt-2 text-text-100 font-sans">True</Text>
            </View>
            <View className="items-center">
              <Check variant="false" />
              <Text className="text-text14 mt-2 text-text-100 font-sans">False</Text>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            StateBall Component
          </Text>
          <View className="flex-row items-center" style={{ gap: 16 }}>
            <View className="items-center">
              <StateBall state="위험" />
              <Text className="text-text14 mt-2 text-text-100 font-sans">위험</Text>
            </View>
            <View className="items-center">
              <StateBall state="보통" />
              <Text className="text-text14 mt-2 text-text-100 font-sans">보통</Text>
            </View>
            <View className="items-center">
              <StateBall state="양호" />
              <Text className="text-text14 mt-2 text-text-100 font-sans">양호</Text>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            Card Component
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 16 }}>
            <Card
              variant="empty"
              onPress={() => console.log('Add new card pressed')}
            />
            <Card
              title="당근"
              subtitle="소비기한 D-3"
              status="위험"
              visible={true}
              onPress={() => console.log('Card pressed')}
            />
            <Card
              title="감자"
              subtitle="소비기한 D-5"
              status="보통"
              visible={true}
              onPress={() => console.log('Card pressed')}
            />
            <Card
              title="양파"
              subtitle="소비기한 D-10"
              status="양호"
              visible={true}
              onPress={() => console.log('Card pressed')}
            />
            <Card
              title="상추"
              subtitle="소비기한 D-15"
              status="양호"
              visible={false}
              onPress={() => console.log('Card pressed')}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            Banner Component
          </Text>
          <Banner onPress={(variant) => console.log(`${variant} banner pressed`)} />
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            InputBox Component
          </Text>
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-text14 mb-2 text-text-100 font-sans">Email Input</Text>
              <InputBox
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="이메일 입력"
              />
            </View>
            <View>
              <Text className="text-text14 mb-2 text-text-100 font-sans">Password Input</Text>
              <InputBox
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호 입력"
              />
            </View>
            <View>
              <Text className="text-text14 mb-2 text-text-100 font-sans">Email with Check</Text>
              <InputBox
                type="email"
                value={emailWithCheck}
                onChangeText={setEmailWithCheck}
                showCheck={true}
              />
            </View>
            <View>
              <Text className="text-text14 mb-2 text-text-100 font-sans">Password with Check</Text>
              <InputBox
                type="password"
                value={passwordWithCheck}
                onChangeText={setPasswordWithCheck}
                showCheck={true}
              />
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            Button Component
          </Text>
          <View className="items-center" style={{ gap: 16 }}>
            <Button onPress={() => console.log('Button pressed')}>
              눌러서 시작하기
            </Button>
            <Button fullWidth onPress={() => console.log('Full width button pressed')}>
              전체 너비 버튼
            </Button>
            <Button disabled>
              비활성화된 버튼
            </Button>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100 font-sans">
            AddButton Component
          </Text>
          <View className="flex-row justify-center" style={{ gap: 16 }}>
            <AddButton
              icon="photo"
              onReceiptPress={() => console.log('Receipt pressed')}
              onCartPress={() => console.log('Cart pressed')}
            />
            <AddButton icon="plus" />
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
