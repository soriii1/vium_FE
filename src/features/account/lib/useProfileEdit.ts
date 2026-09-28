import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { profileStore } from './profileStore';
import { useMyProfile } from './useMyProfile';

export const NICKNAME_MAX_LENGTH = 8;

export const useProfileEdit = () => {
  const { profile: initialProfile } = useMyProfile();
  const [nickname, setNickname] = useState(initialProfile.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(initialProfile.profileImageUrl);

  const trimmedNickname = nickname.trim();
  const isChanged =
    trimmedNickname !== initialProfile.nickname ||
    profileImageUrl !== initialProfile.profileImageUrl;
  const canSave = trimmedNickname.length > 0 && isChanged;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImageUrl(result.assets[0].uri);
    }
  };

  // TODO: 프로필 수정 API 연동 (현재는 앱 메모리에만 저장)
  const save = () => {
    if (!canSave) return false;
    profileStore.updateProfile({ nickname: trimmedNickname, profileImageUrl });
    return true;
  };

  return {
    nickname,
    setNickname,
    clearNickname: () => setNickname(''),
    profileImageUrl,
    handle: initialProfile.handle,
    pickImage,
    canSave,
    save,
  };
};
