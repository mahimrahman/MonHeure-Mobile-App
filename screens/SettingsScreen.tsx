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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function SettingsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoLocation, setAutoLocation] = useState(true);
  const [calendarSettings, setCalendarSettings] = useState(false);
  const [fbPixelKey, setFbPixelKey] = useState('');
  const [paymentMethods, setPaymentMethods] = useState(false);

  // Use global theme context
  const { isDarkMode, toggleTheme, setTheme } = useTheme();

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
      const savedAutoLocation = await AsyncStorage.getItem('autoLocation');
      const savedCalendarSettings = await AsyncStorage.getItem('calendarSettings');
      const savedFbPixelKey = await AsyncStorage.getItem('fbPixelKey');
      const savedPaymentMethods = await AsyncStorage.getItem('paymentMethods');

      setNotifications(savedNotifications !== 'false');
      setAutoLocation(savedAutoLocation !== 'false');
      setCalendarSettings(savedCalendarSettings === 'true');
      setFbPixelKey(savedFbPixelKey || '');
      setPaymentMethods(savedPaymentMethods === 'true');
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

  // Enhanced settings toggle with haptics
  const handleToggle = (key: string, value: boolean) => {
    Haptics.selectionAsync();
    switch (key) {
      case 'darkMode':
        setTheme(value);
        break;
      case 'notifications':
        setNotifications(value);
        saveSetting('notifications', value);
        break;
      case 'autoLocation':
        setAutoLocation(value);
        saveSetting('autoLocation', value);
        break;
      case 'calendarSettings':
        setCalendarSettings(value);
        saveSetting('calendarSettings', value);
        break;
      case 'paymentMethods':
        setPaymentMethods(value);
        saveSetting('paymentMethods', value);
        break;
    }
  };

  // Enhanced clear data with haptics
  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your punch records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await refreshTodayData();
              Alert.alert('✅ Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('❌ Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  // Enhanced export data with haptics
  const handleExportData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const data = await exportData();
      Alert.alert('✅ Success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('❌ Error', 'Failed to export data');
    }
  };

  // Enhanced import data with haptics
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

  // Enhanced share app with haptics
  const handleShareApp = () => {
    Haptics.selectionAsync();
    shareApp();
  };

  // Enhanced feedback with haptics
  const handleSendFeedback = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'Send Feedback',
      'Thank you for your feedback! You\'ll receive FREE SWAG for helping us improve.',
      [{ text: 'OK' }]
    );
  };

  const handleEditProfile = () => {
    Haptics.selectionAsync();
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleFbPixelKey = () => {
    Haptics.selectionAsync();
    Alert.alert('FB Pixel Key', 'Add your Facebook Pixel tracking key here.');
  };

  const handlePaymentMethods = () => {
    Haptics.selectionAsync();
    Alert.alert('Payment Methods', 'Manage your payment methods here.');
  };

  const handleTermsConditions = () => {
    Haptics.selectionAsync();
    Alert.alert('Terms & Conditions', 'View our terms and conditions.');
  };

  const handlePrivacyPolicy = () => {
    Haptics.selectionAsync();
    Alert.alert('Privacy Policy', 'View our privacy policy.');
  };

  const handleShareMessages = () => {
    Haptics.selectionAsync();
    Alert.alert('Share Messages', 'Share your messages and updates.');
  };

  const handleCalendarSettings = () => {
    Haptics.selectionAsync();
    Alert.alert('Calendar Settings', 'Configure your calendar preferences.');
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  // Theme-aware colors
  const backgroundColor = isDarkMode ? '#1F2937' : '#F9FAFB';
  const cardBackgroundColor = isDarkMode ? '#374151' : '#FFFFFF';
  const textPrimaryColor = isDarkMode ? '#F9FAFB' : '#111827';
  const textSecondaryColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const borderColor = isDarkMode ? '#4B5563' : '#E5E7EB';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} className="flex-1">
      {/* Header */}
      <Animated.View style={headerAnimatedStyle} className="px-6 py-4">
        <Text style={{ color: textPrimaryColor }} className="text-3xl font-bold">Settings</Text>
      </Animated.View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-6 space-y-6">
          {/* User Profile Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View style={{ backgroundColor: cardBackgroundColor, borderColor }} className="rounded-2xl p-6 border shadow-md">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-16 h-16 bg-gradient-to-r from-primary-indigo to-primary-violet rounded-full justify-center items-center mr-4">
                    <Text className="text-white text-xl font-bold">JD</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text style={{ color: textPrimaryColor }} className="text-lg font-semibold">John Doe</Text>
                      <Ionicons name="chevron-down" size={16} color={textSecondaryColor} style={{ marginLeft: 8 }} />
                    </View>
                    <Text style={{ color: textSecondaryColor }} className="text-sm">johndoe342@gmail.com</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center"
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile"
                  style={{ minWidth: 44, minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: '#6366F1', borderless: false, radius: 22 } } : {})}
                >
                  <Ionicons name="create" size={16} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* APP SETTINGS Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View style={{ backgroundColor: cardBackgroundColor, borderColor }} className="rounded-2xl border shadow-md overflow-hidden">
              <View className="px-6 py-4 border-b" style={{ borderColor }}>
                <Text style={{ color: textPrimaryColor }} className="text-lg font-bold">APP SETTINGS</Text>
              </View>
              
              <View className="divide-y" style={{ borderColor }}>
                <TouchableOpacity
                  onPress={() => handleToggle('notifications', !notifications)}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Toggle notifications"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="notifications" size={20} color="#3B82F6" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Notifications</Text>
                  </View>
                  <Switch
                    value={notifications}
                    onValueChange={(value) => handleToggle('notifications', value)}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#E5E7EB"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleToggle('autoLocation', !autoLocation)}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Toggle auto location"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="location" size={20} color="#10B981" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Auto Location</Text>
                  </View>
                  <Switch
                    value={autoLocation}
                    onValueChange={(value) => handleToggle('autoLocation', value)}
                    trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#E5E7EB"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCalendarSettings}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Calendar settings"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-purple-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="calendar" size={20} color="#8B5CF6" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Calendar Settings</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleTermsConditions}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Terms and conditions"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="information-circle" size={20} color="#3B82F6" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Terms & Conditions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePrivacyPolicy}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Privacy policy"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="shield-checkmark" size={20} color="#10B981" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Privacy Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShareMessages}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Share messages"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-pink-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="chatbubble-ellipses" size={20} color="#EC4899" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Share Messages</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* INTEGRATION & PAYMENTS Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View style={{ backgroundColor: cardBackgroundColor, borderColor }} className="rounded-2xl border shadow-md overflow-hidden">
              <View className="px-6 py-4 border-b" style={{ borderColor }}>
                <Text style={{ color: textPrimaryColor }} className="text-lg font-bold">INTEGRATION & PAYMENTS</Text>
              </View>
              
              <View className="divide-y" style={{ borderColor }}>
                <TouchableOpacity
                  onPress={handleFbPixelKey}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Add FB Pixel key"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="add" size={20} color="#3B82F6" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Add Your FB Pixel Key</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePaymentMethods}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Payment methods"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="card" size={20} color="#10B981" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Payment Methods</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* SUPPORT & FEEDBACK Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View style={{ backgroundColor: cardBackgroundColor, borderColor }} className="rounded-2xl border shadow-md overflow-hidden">
              <View className="px-6 py-4 border-b" style={{ borderColor }}>
                <Text style={{ color: textPrimaryColor }} className="text-lg font-bold">SUPPORT & FEEDBACK</Text>
              </View>
              
              <View className="divide-y" style={{ borderColor }}>
                <TouchableOpacity
                  onPress={handleSendFeedback}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Send feedback"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-orange-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="shirt" size={20} color="#F59E0B" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Send Feedback = FREE SWAG</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShareApp}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Share app"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-purple-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="share-social" size={20} color="#8B5CF6" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Share App</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleExportData}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Export data"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-teal-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="download" size={20} color="#14B8A6" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Export Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleImportData}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Import data"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-indigo-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="upload" size={20} color="#6366F1" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: textPrimaryColor }} className="font-semibold">Import Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} accessibilityIgnoresInvertColors />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleClearData}
                  className="px-6 py-4 flex-row items-center justify-between"
                  accessibilityRole="button"
                  accessibilityLabel="Clear all data"
                  style={{ minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: '#FEE2E2', borderless: false, radius: 20 } } : {})}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-red-100 rounded-full justify-center items-center mr-4">
                      <Ionicons name="trash" size={20} color="#EF4444" accessibilityIgnoresInvertColors />
                    </View>
                    <Text style={{ color: '#EF4444' }} className="font-semibold">Clear All Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#EF4444" accessibilityIgnoresInvertColors />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Dark Mode Toggle */}
          <Animated.View style={cardAnimatedStyle}>
            <View style={{ backgroundColor: cardBackgroundColor, borderColor }} className="rounded-2xl border shadow-md overflow-hidden">
              <View className="px-6 py-4 border-b" style={{ borderColor }}>
                <Text style={{ color: textPrimaryColor }} className="text-lg font-bold">APPEARANCE</Text>
              </View>
              
              <TouchableOpacity
                onPress={() => handleToggle('darkMode', !isDarkMode)}
                className="px-6 py-4 flex-row items-center justify-between"
                accessibilityRole="button"
                accessibilityLabel="Toggle dark mode"
                style={{ minHeight: 44 }}
                {...(Platform.OS === 'android' ? { android_ripple: { color: isDarkMode ? '#4B5563' : '#F3F4F6', borderless: false, radius: 20 } } : {})}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-4">
                    <Ionicons name="moon" size={20} color="#6B7280" accessibilityIgnoresInvertColors />
                  </View>
                  <Text style={{ color: textPrimaryColor }} className="font-semibold">Dark Mode</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={(value) => handleToggle('darkMode', value)}
                  trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E7EB"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 