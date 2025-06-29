import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePunchStore } from '../utils/punchStore';

export default function TabLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializeStore = usePunchStore(state => state.initializeStore);

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

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-red-50">
        <Text className="text-red-600 text-lg font-semibold mb-2">Initialization Error</Text>
        <Text className="text-red-500 text-center px-4">{error}</Text>
      </View>
    );
  }

  if (!isAppReady) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-blue-600 mt-4 text-lg">Initializing App...</Text>
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
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
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