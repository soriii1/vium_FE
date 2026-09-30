import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import HomeIcon from '@/../assets/icons/home-icon.svg';
import FridgeIcon from '@/../assets/icons/fridge-icon.svg';
import ReceiptIcon from '@/../assets/icons/receipt-icon.svg';
import SettingsIcon from '@/../assets/icons/settings-icon.svg';

type NavItem = 'home' | 'fridge' | 'receipt' | 'settings';

const navItems: { key: NavItem; label: string; route: string; Icon: any }[] = [
  { key: 'home', label: '홈', route: '/main', Icon: HomeIcon },
  { key: 'fridge', label: '냉장고', route: '/fridge', Icon: FridgeIcon },
  { key: 'receipt', label: '레시피', route: '/recipe', Icon: ReceiptIcon },
  { key: 'settings', label: '계정', route: '/mypage', Icon: SettingsIcon },
];

const isRouteActive = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export const NavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (route: string) => {
    if (pathname === route) return;
    // Tabs 안에서는 navigate가 기존 탭으로 전환 (push는 화면을 계속 쌓음)
    router.navigate(route as any);
  };

  return (
    <View className="bg-white rounded-[40px] px-6 py-4 flex-row justify-between items-center shadow-sm">
      {navItems.map((item) => {
        const isActive = isRouteActive(pathname, item.route);
        const { Icon } = item;
        return (
          <Pressable
            key={item.key}
            onPress={() => handlePress(item.route)}
            className="items-center flex-1"
          >
            <View className={`w-8 h-8 items-center justify-center mb-1`}>
              <Icon
                width={32}
                height={32}
                color={isActive ? '#333333' : '#C0C0C0'}
              />
            </View>
            <Text className={`text-text14 font-sans ${isActive ? 'text-neutral-500' : 'text-neutral-100'}`}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
