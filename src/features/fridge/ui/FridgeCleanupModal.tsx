import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';

interface FridgeCleanupModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const FridgeCleanupModal: React.FC<FridgeCleanupModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50 items-center justify-center py-10" onPress={onClose}>
        <Pressable
          className="bg-white rounded-2xl items-center justify-center gap-[31px] w-[342px] p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-[24px] font-medium font-sans text-black text-center mt-4">
            지금부터 냉장고 정리를 {'\n'}시작해볼까요?
          </Text>

          <View className="items-center gap-[21px] w-full">
            <Text className="text-text14 font-sans text-neutral-500 text-center">
              냉장고 정리란, 한 번에 다 먹은 음식을 선택하여 제거할 수 있는 기능입니다.
            </Text>

            <Pressable
              className="bg-primary-400 rounded-2xl items-center justify-center p-2.5 w-[256px] mb-4"
              onPress={onConfirm}
            >
              <Text className="text-text14 font-medium font-sans text-black text-center">
                계속진행
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
