import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { usePunchStore } from '../utils/punchStore';

export default function TabLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializeStore = usePunchStore(state => state.initializeStore);

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

  if (error) {
    return (
      <View className="flex-1 bg-gradient-to-b from-red-50 to-red-100 justify-center items-center p-6">
        <Animated.View style={loadingAnimatedStyle} className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm">
          <View className="items-center">
            <Ionicons name="alert-circle" size={64} color="#ef4444" className="mb-4" />
            <Text className="text-red-600 text-xl font-bold mb-2 text-center">Initialization Error</Text>
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (!isAppReady) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 justify-center items-center">
        <Animated.View style={loadingAnimatedStyle} className="bg-white rounded-3xl p-8 shadow-2xl">
          <View className="items-center">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-gray-600 text-lg font-medium mt-4">Initializing App...</Text>
            <Text className="text-gray-500 text-sm mt-2">Setting up your time tracker</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
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
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
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
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#1f2937',
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
  );
} 