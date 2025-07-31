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

  // iOS-style settings group component
  const SettingsGroup = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <View className="mb-6">
      {title && (
        <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-4">
          {title}
        </Text>
      )}
      <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {children}
      </View>
    </View>
  );

  // iOS-style settings row component
  const SettingsRow = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showChevron = true,
    isDestructive = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 ${onPress ? 'active:bg-gray-50 dark:active:bg-gray-700' : ''}`}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="w-8 h-8 rounded-lg justify-center items-center mr-3">
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={isDestructive ? '#EF4444' : (isDarkMode ? '#8B5CF6' : '#6366F1')} 
        />
      </View>
      <View className="flex-1">
        <Text className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && (
        <View className="mr-2">
          {rightElement}
        </View>
      )}
      {showChevron && onPress && (
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color="#C7D2FE" 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
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

        <View className="px-4 pb-8">
          <Animated.View style={cardAnimatedStyle}>
            {/* Appearance Section */}
            <SettingsGroup title="Appearance">
              <SettingsRow
                icon="color-palette"
                title="Theme"
                subtitle={isDarkMode ? "Dark mode is on" : "Light mode is on"}
                rightElement={
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                    thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
                    ios_backgroundColor="#E5E7EB"
                  />
                }
                showChevron={false}
              />
            </SettingsGroup>

            {/* Data Management Section */}
            <SettingsGroup title="Data Management">
              <SettingsRow
                icon="cloud-upload"
                title="Export Data"
                subtitle="Backup your time logs"
                onPress={handleExportData}
              />
              <SettingsRow
                icon="cloud-download"
                title="Import Data"
                subtitle="Restore from backup"
                onPress={handleImportData}
              />
              <SettingsRow
                icon="trash"
                title="Clear All Data"
                subtitle="Permanently delete all data"
                onPress={handleClearData}
                isDestructive={true}
              />
            </SettingsGroup>

            {/* Support Section */}
            <SettingsGroup title="Support">
              <SettingsRow
                icon="share"
                title="Share App"
                subtitle="Tell friends about MonHeure"
                onPress={handleShareApp}
              />
              <SettingsRow
                icon="chatbubble"
                title="Send Feedback"
                subtitle="Help us improve the app"
                onPress={handleSendFeedback}
              />
            </SettingsGroup>

            {/* About Section */}
            <SettingsGroup title="About">
              <SettingsRow
                icon="information-circle"
                title="Version"
                subtitle="1.0.0"
                showChevron={false}
              />
              <SettingsRow
                icon="document-text"
                title="Terms of Service"
                subtitle="Read our terms"
                onPress={() => Alert.alert('Terms of Service', 'Terms of service content...')}
              />
              <SettingsRow
                icon="shield-checkmark"
                title="Privacy Policy"
                subtitle="How we protect your data"
                onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content...')}
              />
            </SettingsGroup>

            {/* App Info */}
            <View className="mt-8 items-center">
              <View className="w-16 h-16 bg-purple-500 rounded-2xl justify-center items-center mb-4">
                <Ionicons name="time" size={32} color="white" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                MonHeure
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Time tracking made simple
              </Text>
              <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Version 1.0.0
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 