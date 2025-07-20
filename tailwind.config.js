/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors - Modern Soft Palette
        primary: {
          indigo: '#6366F1',
          teal: '#14B8A6',
          amber: '#F59E0B',
          violet: '#8B5CF6',
        },
        // Indigo Color Scale
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Teal Color Scale
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Amber Color Scale
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Violet Color Scale
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Background Colors
        background: {
          light: '#F9FAFB',
          dark: '#1F2937',
          card: '#FFFFFF',
          cardDark: '#374151',
        },
        // Text Colors
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          inverse: '#FFFFFF',
          'dark-primary': '#F9FAFB',
          'dark-secondary': '#D1D5DB',
          'dark-tertiary': '#9CA3AF',
        },
        // Dark mode specific colors
        dark: {
          bg: '#1F2937',
          'bg-card': '#374151',
          'bg-secondary': '#4B5563',
          text: '#F9FAFB',
          'text-secondary': '#D1D5DB',
          'text-tertiary': '#9CA3AF',
          border: '#4B5563',
          'border-light': '#6B7280',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      spacing: {
        '18': '72px',
      },
    },
  },
  plugins: [],
} 