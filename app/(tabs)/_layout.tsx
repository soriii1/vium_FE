import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/widgets';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomNavigation />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#FFFFFF' } }}
    >
      <Tabs.Screen name="main" />
      <Tabs.Screen name="fridge" />
      <Tabs.Screen name="recipe" />
      <Tabs.Screen name="mypage" />
      {/* 탭 버튼은 없지만 하단 탭을 유지한 채 홈에서 이동하는 화면 */}
      <Tabs.Screen name="report" options={{ href: null }} />
    </Tabs>
  );
}
