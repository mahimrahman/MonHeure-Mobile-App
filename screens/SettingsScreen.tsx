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
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { clearAllData, exportData, importData } from '../utils/database';
import { usePunchActions } from '../utils/punchStore';
import { shareApp } from '../utils/shareUtils';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  avatar: string;
  timezone: string;
  workHours: {
    start: string;
    end: string;
  };
}

export default function SettingsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    position: 'Software Developer',
    avatar: '',
    timezone: 'America/New_York',
    workHours: {
      start: '09:00',
      end: '17:00'
    }
  });

  // Use global theme context
  const { isDarkMode, toggleTheme, setTheme } = useTheme();
  const router = useRouter();

  // Optimized animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const profileOpacity = useSharedValue(0);
  const profileScale = useSharedValue(0.95);

  const { refreshTodayData } = usePunchActions();

  // Load settings and profile from AsyncStorage
  useEffect(() => {
    loadSettings();
    loadProfile();
  }, []);

  // Optimized animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    cardOpacity.value = withTiming(1, { duration: 600 });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    profileOpacity.value = withTiming(1, { duration: 500 });
    profileScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      setNotifications(savedNotifications !== 'false');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  const saveProfile = useCallback(async (updatedProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving profile:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  const saveSetting = useCallback(async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshTodayData();
      await loadSettings();
      await loadProfile();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshTodayData, loadSettings, loadProfile]);

  const handleToggle = useCallback((key: string, value: boolean) => {
    Haptics.selectionAsync();
    saveSetting(key, value);
    if (key === 'notifications') {
      setNotifications(value);
    }
  }, [saveSetting]);

  const handleThemeToggle = useCallback(() => {
    Haptics.selectionAsync();
    toggleTheme();
  }, [toggleTheme]);

  const handleProfileEdit = useCallback(() => {
    Haptics.selectionAsync();
    setShowProfileModal(true);
  }, []);

  const handleAvatarEdit = useCallback(() => {
    Haptics.selectionAsync();
    setShowAvatarModal(true);
  }, []);

  const handleProfileSave = useCallback((updatedProfile: UserProfile) => {
    saveProfile(updatedProfile);
    setShowProfileModal(false);
    Alert.alert('✅ Success', 'Profile updated successfully');
  }, [saveProfile]);

  const handleClearData = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackType.Medium);
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
  }, [refreshTodayData]);

  const handleExportData = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackType.Medium);
    try {
      await exportData();
      Alert.alert('✅ Success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('❌ Error', 'Failed to export data');
    }
  }, []);

  const handleImportData = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackType.Medium);
    try {
      await importData();
      await refreshTodayData();
      Alert.alert('✅ Success', 'Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      Alert.alert('❌ Error', 'Failed to import data');
    }
  }, [refreshTodayData]);

  const handleShareApp = useCallback(() => {
    Haptics.selectionAsync();
    shareApp();
  }, []);

  const handleSendFeedback = useCallback(() => {
    Haptics.selectionAsync();
    Alert.alert(
      'Send Feedback',
      'Thank you for your feedback! You\'ll receive FREE SWAG for helping us improve.',
      [{ text: 'OK' }]
    );
  }, []);

  // Optimized animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const profileAnimatedStyle = useAnimatedStyle(() => ({
    opacity: profileOpacity.value,
    transform: [{ scale: profileScale.value }],
  }));

  // iOS-style settings group component
  const SettingsGroup = React.memo(({ title, children }: { title?: string; children: React.ReactNode }) => (
    <View className="mb-6">
      {title && (
                    <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4">
              {title}
            </Text>
      )}
      <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {children}
      </View>
    </View>
  ));

  // iOS-style settings row component
  const SettingsRow = React.memo(({ 
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
        <Text className={`text-base font-semibold ${isDestructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
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
  ));

  // Profile Modal Component
  const ProfileModal = React.memo(() => {
    const [editProfile, setEditProfile] = useState<UserProfile>(profile);

    const handleSave = () => {
      if (!editProfile.firstName.trim() || !editProfile.lastName.trim()) {
        Alert.alert('❌ Error', 'First name and last name are required');
        return;
      }
      handleProfileSave(editProfile);
    };

    return (
      <Modal
        visible={showProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 w-80 max-h-96">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Edit Profile
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">First Name</Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium"
                    value={editProfile.firstName}
                    onChangeText={(text) => setEditProfile({...editProfile, firstName: text})}
                    placeholder="First Name"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">Last Name</Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium"
                    value={editProfile.lastName}
                    onChangeText={(text) => setEditProfile({...editProfile, lastName: text})}
                    placeholder="Last Name"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">Email</Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium"
                    value={editProfile.email}
                    onChangeText={(text) => setEditProfile({...editProfile, email: text})}
                    placeholder="Email"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    keyboardType="email-address"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">Company</Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium"
                    value={editProfile.company}
                    onChangeText={(text) => setEditProfile({...editProfile, company: text})}
                    placeholder="Company"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">Position</Text>
                  <TextInput
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium"
                    value={editProfile.position}
                    onChangeText={(text) => setEditProfile({...editProfile, position: text})}
                    placeholder="Position"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </View>
            </ScrollView>
            
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setShowProfileModal(false)}
                className="bg-gray-300 dark:bg-gray-600 py-3 px-6 rounded-lg flex-1 mr-2"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 dark:text-gray-300 font-semibold text-center">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSave}
                className="bg-blue-500 py-3 px-6 rounded-lg flex-1 ml-2"
                activeOpacity={0.7}
              >
                <Text className="text-white font-bold text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  });

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
              <Text className="text-2xl font-extrabold text-gray-900 dark:text-white ml-2">MonHeure</Text>
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
            onPress={() => router.push('/dashboard')}
          >
            <Ionicons name="analytics" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
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
            {/* Profile Section */}
            <Animated.View style={profileAnimatedStyle}>
              <SettingsGroup title="Profile">
                <TouchableOpacity
                  onPress={handleProfileEdit}
                  className="flex-row items-center px-4 py-4 active:bg-gray-50 dark:active:bg-gray-700"
                  activeOpacity={0.7}
                >
                  <View className="w-16 h-16 rounded-full bg-purple-500 justify-center items-center mr-4">
                    {profile.avatar ? (
                      <Image source={{ uri: profile.avatar }} className="w-16 h-16 rounded-full" />
                    ) : (
                      <Text className="text-white text-2xl font-black">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {profile.firstName} {profile.lastName}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {profile.position} at {profile.company}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {profile.email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#C7D2FE" />
                </TouchableOpacity>
              </SettingsGroup>
            </Animated.View>

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
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                MonHeure
              </Text>
              <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Time tracking made simple
              </Text>
              <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-2">
                Version 1.0.0
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <ProfileModal />
    </SafeAreaView>
  );
} 