import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import TomatoImage from '@/../assets/tomato.svg';
import PotatoImage from '@/../assets/potato.svg';
import OnionImage from '@/../assets/onion.svg';

type BannerVariant = 'tomato' | 'potato' | 'onion';

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

  return (
    <View className="w-full" style={style}>
      <View className="h-[162px] rounded-lg overflow-hidden" onLayout={handleLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
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
            hitSlop={6}
            className={`h-[14px] rounded-full ${activeIndex === index ? 'w-[22px] bg-neutral-100' : 'w-[14px] bg-neutral-50'}`}
          />
        ))}
      </View>
    </View>
  );
};
