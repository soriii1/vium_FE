/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      spacing: {
        // 화면 좌우 그리드 마진 — 전 화면 공통 (px-screen)
        screen: '24px',
      },
      fontFamily: {
        sans: ['Paperlogy', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#F7FCF4',
          200: '#E7F6DE',
          300: '#CBEBB7',
          400: '#C1E7A9',
          500: '#B2E194',
          600: '#A2CD87',
          700: '#7EA069',
          800: '#4B5F3E',
        },
        secondary: {
          100: '#FFF4FB',
          200: '#FFD0EF',
          300: '#FFBCE9',
          400: '#FFA0DF',
          500: '#B36298',
          600: '#9C5584',
        },
        neutral: {
          10: '#F4F3F3',
          50: '#EBEBEB',
          100: '#C0C0C0',
          200: '#A1A1A1',
          300: '#767676',
          400: '#5C5C5C',
          500: '#333333',
          700: '#242424',
          800: '#151515',
        },
        text: {
          50: 'rgba(36, 37, 41, 0.5)',
          100: '#242529',
          200: '#737785',
          300: '#A7A9B5',
          400: '#FAFAFA',
        },
      },
      fontSize: {
        title: ['24px', { lineHeight: 'normal' }],
        subtitle: ['20px', { lineHeight: '24px' }],
        text16: ['16px', { lineHeight: 'normal' }],
        text15: ['15px', { lineHeight: 'normal' }],
        text14: ['14px', { lineHeight: 'normal' }],
      },
    },
  },
  plugins: [],
}
