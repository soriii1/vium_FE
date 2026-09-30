import { Alert, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';

export const useIngredientUpload = () => {
  const isCameraAvailable = async () => {
    // 웹 환경에서는 카메라를 다르게 처리
    if (Platform.OS === 'web') {
      return true; // 웹에서는 input capture 속성으로 처리
    }

    // 시뮬레이터/에뮬레이터에서는 카메라를 사용할 수 없음
    console.log('Device.isDevice:', Device.isDevice);
    if (!Device.isDevice) {
      console.log('Running on simulator/emulator - camera disabled');
      return false;
    }

    // 카메라 권한 확인
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    console.log('Camera permission status:', status);
    return status !== 'denied';
  };

  const pickImageFromCamera = async () => {
    // 웹 환경에서는 웹캠으로 직접 촬영
    if (Platform.OS === 'web') {
      return pickImageFromWebCamera();
    }

    // 카메라 사용 가능 여부 확인
    const available = await isCameraAvailable();

    if (!available) {
      Alert.alert(
        '카메라 사용 불가',
        '시뮬레이터에서는 카메라를 사용할 수 없습니다. 실제 기기에서 테스트해주세요.'
      );
      return null;
    }

    // 카메라 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return null;
    }

    try {
      // 카메라 실행
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
    } catch (error) {
      Alert.alert('오류', '카메라를 실행할 수 없습니다.');
      console.error('Camera error:', error);
    }

    return null;
  };

  const pickImageFromGallery = async () => {
    // 웹 환경에서는 파일 선택으로 처리
    if (Platform.OS === 'web') {
      return pickImageFromWebGallery();
    }

    // 미디어 라이브러리 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return null;
    }

    // 갤러리에서 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }

    return null;
  };

  const pickImageFromWebCamera = async (): Promise<string | null> => {
    try {
      // 웹캠 스트림 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // 후면 카메라 우선
        audio: false,
      });

      return new Promise((resolve) => {
        // 비디오 요소 생성
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;

        // 캔버스 요소 생성
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // 오버레이 UI 생성
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `;

        video.style.cssText = 'max-width: 100%; max-height: 80vh;';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px;';

        const captureButton = document.createElement('button');
        captureButton.textContent = '📷 촬영';
        captureButton.style.cssText = 'padding: 15px 30px; font-size: 18px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 5px;';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '❌ 취소';
        cancelButton.style.cssText = 'padding: 15px 30px; font-size: 18px; cursor: pointer; background: #f44336; color: white; border: none; border-radius: 5px;';

        buttonContainer.appendChild(captureButton);
        buttonContainer.appendChild(cancelButton);

        overlay.appendChild(video);
        overlay.appendChild(buttonContainer);
        document.body.appendChild(overlay);

        const cleanup = () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(overlay);
        };

        captureButton.onclick = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context?.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          cleanup();
          resolve(dataUrl);
        };

        cancelButton.onclick = () => {
          cleanup();
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Camera access error:', error);
      alert('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
      return null;
    }
  };

  const pickImageFromWebGallery = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            console.error('Failed to read file');
            resolve(null);
          };
          reader.readAsDataURL(file);
        } else {
          resolve(null);
        }
      };

      input.oncancel = () => {
        resolve(null);
      };

      input.click();
    });
  };

  const showIngredientUploadOptions = async (onImageSelected?: (uri: string) => void) => {
    const handleImageSelected = async (picker: () => Promise<string | null>) => {
      const uri = await picker();
      if (uri) {
        console.log('선택된 재료 이미지:', uri);
        onImageSelected?.(uri);
      }
    };

    if (Platform.OS === 'web') {
      // 웹: confirm으로 카메라/갤러리 선택
      const useCamera = confirm('사진을 촬영하시겠습니까?\n\n확인: 카메라로 촬영\n취소: 파일에서 선택');
      if (useCamera) {
        handleImageSelected(pickImageFromCamera);
      } else {
        handleImageSelected(pickImageFromGallery);
      }
    } else if (Platform.OS === 'ios') {
      // iOS: 항상 모든 옵션 표시 (시뮬레이터에서도 UI 확인 가능)
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '사진 촬영', '갤러리에서 선택'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleImageSelected(pickImageFromCamera);
          } else if (buttonIndex === 2) {
            handleImageSelected(pickImageFromGallery);
          }
        }
      );
    } else {
      // Android: 항상 모든 옵션 표시
      Alert.alert(
        '재료 등록',
        '재료를 등록할 방법을 선택하세요',
        [
          { text: '취소', style: 'cancel' },
          { text: '사진 촬영', onPress: () => handleImageSelected(pickImageFromCamera) },
          { text: '갤러리에서 선택', onPress: () => handleImageSelected(pickImageFromGallery) },
        ]
      );
    }
  };

  return {
    pickImageFromCamera,
    pickImageFromGallery,
    showIngredientUploadOptions,
  };
};
