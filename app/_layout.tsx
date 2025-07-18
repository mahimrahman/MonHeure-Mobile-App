import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

function TabLayoutContent() {
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
  const borderColor = isDarkMode ? '#4B5563' : '#E5E7EB';

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor }} className="justify-center items-center p-6">
          <Animated.View style={loadingAnimatedStyle} className="rounded-3xl p-8 shadow-2xl max-w-sm" style={{ backgroundColor: cardBackgroundColor }}>
            <View className="items-center">
              <Ionicons name="alert-circle" size={64} color="#ef4444" className="mb-4" />
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
          <Animated.View style={loadingAnimatedStyle} className="rounded-3xl p-8 shadow-2xl" style={{ backgroundColor: cardBackgroundColor }}>
            <View className="items-center">
              <ActivityIndicator size="large" color="#0ea5e9" />
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
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'index') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'dashboard') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } else if (route.name === 'report') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'history') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0ea5e9',
          tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
          tabBarStyle: {
            backgroundColor: cardBackgroundColor,
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerStyle: {
            backgroundColor: cardBackgroundColor,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: textPrimaryColor,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerShadowVisible: false,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: 'Report',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <TabLayoutContent />
    </ThemeProvider>
  );
} 