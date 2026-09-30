import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  AppState,
  AccessibilityInfo,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import TomatoImage from '@/../assets/tomato.svg';
import PotatoImage from '@/../assets/potato.svg';
import OnionImage from '@/../assets/onion.svg';

type BannerVariant = 'tomato' | 'potato' | 'onion';

// 배너 문구(두 줄)를 읽을 시간을 고려한 자동 넘김 간격
const AUTO_ADVANCE_MS = 5000;

interface BannerProps {
  /** 처음 보여줄 배너 */
  variant?: BannerVariant;
  onPress?: (variant: BannerVariant) => void;
  style?: any;
}

const SLIDES: {
  variant: BannerVariant;
  subtitle: string;
  title1: string;
  title2: string;
  action: string;
  ImageComponent: any;
  imageSize: { width: number; height: number };
}[] = [
  {
    variant: 'tomato',
    subtitle: '냉털 레시피를 추천 받을까요?',
    title1: '지금 무지방 우유의 ',
    title2: '소비기한이 3일 남았어요!',
    action: '레시피 바로가기 >',
    ImageComponent: TomatoImage,
    imageSize: { width: 104, height: 114 },
  },
  {
    variant: 'potato',
    subtitle: '이번달 리포트를 확인할까요?',
    title1: '이번달에 가장',
    title2: '많이 남긴 음식은 뭘까요?',
    action: '리포트 바로가기 >',
    ImageComponent: PotatoImage,
    imageSize: { width: 104, height: 114 },
  },
  {
    variant: 'onion',
    subtitle: '장보기 추천을 받아보실래요?',
    title1: '곧 마트를 가야할',
    title2: '시기네요!',
    action: '추천 장보기 목록 >',
    ImageComponent: OnionImage,
    imageSize: { width: 100, height: 136 },
  },
];

export const Banner: React.FC<BannerProps> = ({ variant = 'tomato', onPress, style }) => {
  const scrollRef = useRef<ScrollView>(null);
  const initialIndex = Math.max(0, SLIDES.findIndex((slide) => slide.variant === variant));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [width, setWidth] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');
  const [isReduceMotion, setIsReduceMotion] = useState(false);

  // 다른 탭/화면으로 가면 멈춤
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setIsAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);

  // 기기의 '동작 줄이기' 설정이 켜져 있으면 자동 넘김 끔
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsReduceMotion);
    return () => subscription.remove();
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth === width) return;
    setWidth(nextWidth);
    // 너비가 정해진 뒤 현재 배너 위치로 맞춤
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: nextWidth * activeIndex, animated: false });
    });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  // activeIndex가 바뀔 때마다(자동/손으로 넘김/점 탭) 타이머를 처음부터 다시 셈
  useEffect(() => {
    if (!width || isTouching || !isFocused || !isAppActive || isReduceMotion) return;
    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % SLIDES.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, width, isTouching, isFocused, isAppActive, isReduceMotion]);

  return (
    <View className="w-full" style={style}>
      <View className="h-[162px] rounded-lg overflow-hidden" onLayout={handleLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          // 누르고 있거나 드래그하는 동안에는 자동 넘김 멈춤
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setIsTouching(false)}
          onTouchCancel={() => setIsTouching(false)}
          onScrollBeginDrag={() => setIsTouching(true)}
          onMomentumScrollBegin={() => setIsTouching(false)}
        >
          {SLIDES.map((slide) => (
            <Pressable
              key={slide.variant}
              style={{ width }}
              className="bg-primary-300 px-5 py-2.5 flex-row items-center justify-between h-[162px]"
              onPress={() => onPress?.(slide.variant)}
            >
              <View className="flex-1 justify-between h-full py-2">
                <View>
                  <Text className="text-text-50 text-[14px] mb-1 font-sans">
                    {slide.subtitle}
                  </Text>
                  <Text className="text-text-100 text-subtitle font-medium font-sans">
                    {slide.title1}
                  </Text>
                  <Text className="text-text-100 text-subtitle font-medium font-sans">
                    {slide.title2}
                  </Text>
                </View>
                <Text className="text-text-50 text-[12px] font-sans">
                  {slide.action}
                </Text>
              </View>
              <slide.ImageComponent {...slide.imageSize} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="flex-row items-center justify-center gap-[11px] mt-[19px]">
        {SLIDES.map((slide, index) => (
          <Pressable
            key={slide.variant}
            onPress={() => goTo(index)}
            hitSlop={10}
            className={`h-3 rounded-full ${activeIndex === index ? 'w-[22px] bg-neutral-100' : 'w-[14px] bg-neutral-50'}`}
          />
        ))}
      </View>
    </View>
  );
};
