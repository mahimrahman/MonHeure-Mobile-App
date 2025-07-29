import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { usePunchStore } from '../utils/punchStore';
import { ThemeProvider, useTheme } from '../utils/themeContext';
import '../global.css';

function LayoutContent() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializeStore = usePunchStore(state => state.initializeStore);
  const { isDarkMode } = useTheme();

  // Animation values
  const loadingOpacity = useSharedValue(1);
  const loadingScale = useSharedValue(1);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeStore();
        setIsAppReady(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to initialize app');
      }
    };

    initializeApp();
  }, [initializeStore]);

  // Loading animation
  const loadingAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
      transform: [{ scale: loadingScale.value }],
    };
  });

  // Theme-aware colors
  const backgroundColor = isDarkMode ? '#1F2937' : '#F9FAFB';
  const cardBackgroundColor = isDarkMode ? '#374151' : '#FFFFFF';
  const textPrimaryColor = isDarkMode ? '#F9FAFB' : '#111827';
  const textSecondaryColor = isDarkMode ? '#9CA3AF' : '#6B7280';

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor }} className="justify-center items-center p-6">
          <Animated.View style={[loadingAnimatedStyle, { backgroundColor: cardBackgroundColor }]} className="rounded-3xl p-8 shadow-2xl max-w-sm">
            <View className="items-center">
              <Text style={{ color: '#ef4444' }} className="text-xl font-bold mb-2 text-center">Initialization Error</Text>
              <Text style={{ color: textSecondaryColor }} className="text-center">{error}</Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isAppReady) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor }} className="justify-center items-center">
          <Animated.View style={[loadingAnimatedStyle, { backgroundColor: cardBackgroundColor }]} className="rounded-3xl p-8 shadow-2xl">
            <View className="items-center">
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={{ color: textPrimaryColor }} className="text-lg font-medium mt-4">Initializing App...</Text>
              <Text style={{ color: textSecondaryColor }} className="text-sm mt-2">Setting up your time tracker</Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
} 