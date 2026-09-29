import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card } from '@/shared/ui';

interface FridgeItem {
  id: number;
  title: string;
  subtitle: string;
  status: '위험' | '보통' | '양호';
  image?: any;
}

interface FridgeGridProps {
  items: FridgeItem[];
  onAddPress: () => void;
  onItemPress: (item: FridgeItem) => void;
}

export const FridgeGrid: React.FC<FridgeGridProps> = ({
  items,
  onAddPress,
  onItemPress,
}) => {
  return (
    <ScrollView className="flex-1 px-4 md:px-8 lg:px-16" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex-row flex-wrap -mx-2 max-w-[1200px] mx-auto w-full">
        {/* Empty Card */}
        <View className="mb-4 px-2 w-1/3 md:w-1/4 lg:w-1/5">
          <Card variant="empty" onPress={onAddPress} />
        </View>

        {/* Fridge Items */}
        {items.map((item) => (
          <View key={item.id} className="mb-4 px-2 w-1/3 md:w-1/4 lg:w-1/5">
            <Card
              title={item.title}
              subtitle={item.subtitle}
              status={item.status}
              image={item.image}
              visible={true}
              onPress={() => onItemPress(item)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
