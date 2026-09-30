import { useState } from 'react';

export const useFridgeCleanup = () => {
  const [isCleanupModalVisible, setIsCleanupModalVisible] = useState(false);

  const openCleanupModal = () => setIsCleanupModalVisible(true);
  const closeCleanupModal = () => setIsCleanupModalVisible(false);

  return {
    isCleanupModalVisible,
    openCleanupModal,
    closeCleanupModal,
  };
};
