import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  withDelay
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { clearAllData, exportData, importData } from '../utils/database';
import { usePunchActions } from '../utils/punchStore';
import { shareApp } from '../utils/shareUtils';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Use global theme context
  const { isDarkMode, toggleTheme, setTheme } = useTheme();
  const router = useRouter();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  const { refreshTodayData } = usePunchActions();

  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  // Start animations on mount
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    cardTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      setNotifications(savedNotifications !== 'false');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshTodayData();
      await loadSettings();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshTodayData]);

  const handleToggle = (key: string, value: boolean) => {
    Haptics.selectionAsync();
    saveSetting(key, value);
    if (key === 'notifications') {
      setNotifications(value);
    }
  };

  const handleThemeToggle = () => {
    Haptics.selectionAsync();
    toggleTheme();
  };

  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to permanently delete all your punch logs? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await refreshTodayData();
              Alert.alert('✅ Success', 'All data has been cleared successfully');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('❌ Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await exportData();
      Alert.alert('✅ Success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('❌ Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await importData();
      await refreshTodayData();
      Alert.alert('✅ Success', 'Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      Alert.alert('❌ Error', 'Failed to import data');
    }
  };

  const handleShareApp = () => {
    Haptics.selectionAsync();
    shareApp();
  };

  const handleSendFeedback = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'Send Feedback',
      'Thank you for your feedback! You\'ll receive FREE SWAG for helping us improve.',
      [{ text: 'OK' }]
    );
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View style={headerAnimatedStyle} className="pt-4 pb-6 px-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time" size={24} color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
              <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">MonHeure</Text>
            </View>
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons 
                name={isDarkMode ? 'sunny' : 'moon'} 
                size={24} 
                color={isDarkMode ? '#F59E0B' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Navigation Icons */}
        <View className="flex-row justify-center mb-8">
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/')}
          >
            <Ionicons name="time" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/history')}
          >
            <Ionicons name="list" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 bg-purple-500 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-8">
          {/* Settings Title */}
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Settings
          </Text>

          <Animated.View style={cardAnimatedStyle} className="space-y-6">
            {/* Appearance Section */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Appearance
              </Text>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-yellow-500 rounded-lg justify-center items-center mr-3">
                    <Ionicons name="sunny" size={20} color="white" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-medium text-lg">Theme</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name="sunny" 
                    size={16} 
                    color={isDarkMode ? '#9CA3AF' : '#F59E0B'} 
                  />
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                    thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
                    ios_backgroundColor="#E5E7EB"
                    style={{ marginHorizontal: 8 }}
                  />
                  <Ionicons 
                    name="moon" 
                    size={16} 
                    color={isDarkMode ? '#8B5CF6' : '#9CA3AF'} 
                  />
                </View>
              </View>
            </View>

            {/* Data Management Section */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Data Management
              </Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-900 dark:text-white font-medium text-lg mb-2">
                    Clear All Data
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Permanently delete all your punch logs.
                  </Text>
                  <TouchableOpacity
                    onPress={handleClearData}
                    className="bg-red-500 px-4 py-3 rounded-lg flex-row items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Clear Data</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Additional Options */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Additional Options
              </Text>
              
              <View className="space-y-4">
                <TouchableOpacity
                  onPress={handleExportData}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="download" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">Export Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleImportData}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="upload" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">Import Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShareApp}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-purple-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="share" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">Share App</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSendFeedback}
                  className="flex-row items-center justify-between py-3"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-orange-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="chatbubble" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">Send Feedback</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 